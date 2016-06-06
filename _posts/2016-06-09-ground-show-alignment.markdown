---
layout: post
title:  "神经网络机器翻译开源代码 GroundHog ：输出对齐信息"
location: 北理的实验室
date:   2016-06-09 00:00:00 +0800
categories: "NMT"
tags: "神经网络机器翻译 NMT GroundHog Theano"
---

<a href="#bahdanau2014">[Bahdanau, Cho and Bengio 2014]</a> 的论文是神经网络机器翻译（Neural Machine Translation， NMT）领域重要的论文，该论文首次将学习源语言与目标语言的对齐关系引入 NMT 的模型之中，后来这个“对齐模型”被“注意力模型（Attention model）”这个更具有普遍意义的名字取代。本文将介绍如何在 <a href="#bahdanau2014">[Bahdanau, Cho and Bengio 2014]</a> 对应的开源代码 <a href="#groundhog">GroundHog</a> 上面进行修改，输出“对齐信息”(或“注意力信息”)。其中分上下两部分，本文为上半部，先带领读者熟悉下相关代码的功能。


<a href="#bahdanau2014">[Bahdanau, Cho and Bengio 2014]</a> 的论文是神经网络机器翻译（Neural Machine Translation， NMT）领域重要的论文，笔者认为是这篇论文拉开了神经网络机器翻译超越统计机器翻译的大幕。更为重要的是，这篇论文的源代码的 github 工程也在论文发表后公开，使得其他团队的研究人员可以轻松地复制其工作，而这篇论文的重要性也足以作为 NMT 的头号 baseline。在 <a href="#bahdanau2014">[Bahdanau, Cho and Bengio 2014]</a> 的论文中有一些很漂亮的显示对齐关系的图片给人印象深刻。笔者仿造 Bahdanau 的方法也做的类似的图片如下：
<img  src="{{ site.baseurl }}/images/alignment.jpg" align="middle" height="340px" width="370px" />

这张图的翻译结果是笔者亲自训练的 <a href="#groundhog">GroundHog</a> 得到真实翻译结果，其中汉语为源语言，英语为目标语言，对齐矩阵颜色越亮代表关联程度或注意力（Attention）越强，下面将具体介绍如何获取这部分数值。

<br /><font color="green">/************************************************** 废话分割线 ***************************************************/</font><br />

<a href="#groundhog">GroundHog</a> 全部用 Python + Theano 编写（Theano 是由蒙特利尔大学的 Y. Bengio 带队开发的）。源代码中充斥着一环套一环的符号化编程，很难调试，笔者也是用尽了 tricks 才实现上图功能的。关于 <a href="#groundhog">GroundHog</a> 从头至尾的代码学习指南笔者准备过些时间专门写，这里只介绍如何使其在翻译时输出对齐信息（注意力信息），另外假设读者已经掌握如何用<a href="#groundhog">GroundHog</a>训练模型了！
<br/>
简单看下<a href="#groundhog">GroundHog</a>这个github工程的目录结构。
<pre><code>
GroundHog
    ├── doc
    ├── experiments
    ├── groundhog
    ├── groundhog.egg-info
    ├── LICENSE
    ├── README.md
    ├── scripts
    ├── setup.py
    └── tutorials
</code></pre>
有点复杂，但就我们目前的需求（输出对齐信息）来说，只在乎 `GroundHog/experiments/nmt/` 目录下的`.py`文件即可。(其实`GroundHog/experiments/nmt/web-demo/`下的代码文件十分值得阅读和试验)
<pre><code>
GroundHog/experiments/nmt/
├── analysis.py
├── encdec.py
├── __init__.py
├── numpy_compat.py
├── preprocess
├── README.md
├── sample.py
├── score.py
├── segment.py
├── state.py
├── train.py
├── tree.py
</code></pre>
如果读者掌握如何使用该代码训练模型，就知道`state.py`文件的作用了，如果读者已经会使用该代码进行批量的翻译，那么`sample.py`的使用肯定也大致掌握。打开`sample.py`，看名字就能看出来函数`sample(...)`和类`BeamSearch`是要学习的重点，既然这样，我们先看下`main()`的内容

{% highlight python %}
def main():
  #{此处省略 sample.py 的 [223, 239] 行}
  beam_search = None
  if args.beam_search:
    beam_search = BeamSearch(enc_dec)
    beam_search.compile()

  if args.source and args.trans:

    fsrc = open(args.source, 'r')
    ftrans = open(args.trans, 'w')

    n_samples = args.beam_size
    total_cost = 0.0

    for i, line in enumerate(fsrc):
      seqin = line.strip()
      seq, parsed_in = parse_input(state, indx_word, seqin, idx2word=idict_src)

      trans, costs, _ = sample(lm_model, seq, n_samples, sampler=sampler,
        beam_search=beam_search, ignore_unk=args.ignore_unk, normalize=args.normalize)
      best = numpy.argmin(costs)
      print >>ftrans, trans[best]

  fsrc.close()
  ftrans.close()
{% endhighlight %}

省去一些无关细节后的代码就是上面酱婶儿的，先实例化一个`BeamSearch`类，翻译的过程在下面，聪明的你一眼就看到简化的代码中的`trans, costs, _ = sample(..)`这一行了，是的`sample(..)`函数返回了翻译候选和对应的cost（代价？），它上面一行`seq, parsed_in = parse_input(state, indx_word, seqin, idx2word=idict_src)`只是把输入转换为字典里index而已。

所以下面要分析`sample(..)`了：

{% highlight python %}
def sample(lm_model, seq, n_samples,
        sampler=None, beam_search=None,
        ignore_unk=False, normalize=False,
        alpha=1, verbose=False):
    if beam_search:
        sentences = []
        trans, costs = beam_search.search(seq, n_samples,
                ignore_unk=ignore_unk, minlen=len(seq) / 2)
        if normalize:
            counts = [len(s) for s in trans]
            costs = [co / cn for co, cn in zip(costs, counts)]
        for i in range(len(trans)):
            sen = indices_to_words(lm_model.word_indxs, trans[i])
            sentences.append(" ".join(sen))
        for i in range(len(costs)):
            if verbose:
                print "{}: {}".format(costs[i], sentences[i])
        return sentences, costs, trans
{% endhighlight %}

有没有一种被骗的感觉，这个`sample(..)`只是对`beam_search.search(..)`函数的结果做了一些处理而已，好的，那我们直接去啃`BeamSearch`这块小骨头就好了！笔者想了很久啃骨头的方法，觉得直接在代码里面添加注释这种方法最简单粗暴有效，请看：

{% highlight python %}
class BeamSearch(object):

    def __init__(self, enc_dec):
        self.enc_dec = enc_dec
        state = self.enc_dec.state
        self.eos_id = state['null_sym_target']
        self.unk_id = state['unk_sym_target']

    def compile(self):
        #这里先把下面用到的函数编译好了
        self.comp_repr = self.enc_dec.create_representation_computer()
        self.comp_init_states = self.enc_dec.create_initializers()
        self.comp_next_probs = self.enc_dec.create_next_probs_computer()
        self.comp_next_states = self.enc_dec.create_next_states_computer()

    #这里是BeamSearch的核心部分，seq就是输入的序列，就是源语言，只不过是转换成字典里的index了，n_samples就是候选的数目
    def search(self, seq, n_samples, ignore_unk=False, minlen=1):
        c = self.comp_repr(seq)[0]
        states = map(lambda x : x[None, :], self.comp_init_states(c))
        dim = states[0].shape[1]

        num_levels = len(states)

        fin_trans = []
        fin_costs = []

        trans = [[]]
        costs = [0.0]

        #看到这里也许会有个疑问：为什么是 3*len(seq) 对不对？
        #这里每次迭代都会输出一组候选目标语言词，所以迭代次数对应的是生成的目标语言的词数，
        #设置成 3倍的源语言长度通常情况是足够的，必要时按照需求修改即可
        #（例如对字符而不是词建模之类的，可能需要相应增加迭代次数）
        for k in range(3 * len(seq)):
            if n_samples == 0:
                break

            # Compute probabilities of the next words for
            # all the elements of the beam.
            beam_size = len(trans)
            last_words = (numpy.array(map(lambda t : t[-1], trans))
                    if k > 0
                    else numpy.zeros(beam_size, dtype="int64"))

            #这里self.comp_next_probs(..)的返回值就是神经网络的输出
            log_probs = numpy.log(self.comp_next_probs(c, k, last_words, *states)[0])

            #.....此处省略n行......
{% endhighlight %}

考虑了再三，笔者决定先直奔主题——返回对齐信息，对齐信息是同 decoder 的输出一同得到的，而 decoder的输出就是上述代码最好一行`self.comp_next_probs(...)`得到的，而这个函数的来源在`compile(...)`函数中写得明白，是`self.enc_dec.create_next_probs_computer()`。也就类成员`self.enc_dec`的函数，而`self.enc_dec`正是在另一个文件`encdec.py`中定义的类`RNNEncoderDecoder`，也就是说，我们去到那个类下面稍微修改下相关函数就可以了。

按照上面的线索，首先要找到类`RNNEncoderDecoder`下面的函数`create_next_probs_computer()`，代码如下：

{% highlight python %}
def create_next_probs_computer(self):
    if not hasattr(self, 'next_probs_fn'):
        self.next_probs_fn = theano.function(
                inputs=[self.c, self.step_num, self.gen_y] + self.current_states,
                outputs=[self.decoder.build_next_probs_predictor(
                    self.c, self.step_num, self.gen_y, self.current_states)],
                name="next_probs_fn")
    return self.next_probs_fn
{% endhighlight %}

毫无意外，函数返回的是一个以`self.decoder.build_next_probs_predictor(...)`为输出的`theano.function`，所以继续追溯，线索指向了类`Decoder`中的`decoder.build_next_probs_predictor(...)`函数：

{% highlight python %}
def build_next_probs_predictor(self, c, step_num, y, init_states):
    return self.build_decoder(c, y, mode=Decoder.BEAM_SEARCH,
            given_init_states=init_states, step_num=step_num)
{% endhighlight %}

OK，我们找到的这个`decoder.build_next_probs_predictor(...)`函数什么都没有做，只返回了类`Decoder`下的另外一个函数`build_decoder(...)`，看名字就知道是块儿硬骨头，不过不要担心先去看看再说：

{% highlight python %}
result = self.transitions[level](
    input_signals[level],
    mask=y_mask,
    gater_below=none_if_zero(update_signals[level]),
    reseter_below=none_if_zero(reset_signals[level]),
    one_step=mode != Decoder.EVALUATION,
    use_noise=mode == Decoder.EVALUATION,
    **add_kwargs)
if self.state['search']: #整个文件的#1100行
    if self.compute_alignment:
        #This implicitly wraps each element of result.out with a Layer to keep track of the parameters.
        #It is equivalent to h=result[0], ctx=result[1] etc. 
        h, ctx, alignment = result
{% endhighlight %}

一不小心我们就发现了上面这段代码，这个`alignment`是我们想要的那个么？不急，先看看那个`result`是什么。
从上述代码中可以看到，`result`的结果来自于`self.transitions[level](...)`，发现这个`transitions`是个列表，来自于鸡肋哦不对基类`EncoderDecoderBase`：

{% highlight python %}
def _create_transition_layers(self):
    logger.debug("_create_transition_layers")
    self.transitions = []
    rec_layer = eval(prefix_lookup(self.state, self.prefix, 'rec_layer'))
    add_args = dict()
    #看这里
    if rec_layer == RecurrentLayerWithSearch:
        add_args = dict(c_dim=self.state['c_dim'])
    for level in range(self.num_levels):
        self.transitions.append(rec_layer(
                self.rng,
                n_hids=self.state['dim'],
                activation=prefix_lookup(self.state, self.prefix, 'activ'),
                bias_scale=self.state['bias'],
                init_fn=(self.state['rec_weight_init_fn']
                    if not self.skip_init
                    else "sample_zeros"),
                scale=prefix_lookup(self.state, self.prefix, 'rec_weight_scale'),
                weight_noise=self.state['weight_noise_rec'],
                dropout=self.state['dropout_rec'],
                gating=prefix_lookup(self.state, self.prefix, 'rec_gating'),
                gater_activation=prefix_lookup(self.state, self.prefix, 'rec_gater'),
                reseting=prefix_lookup(self.state, self.prefix, 'rec_reseting'),
                reseter_activation=prefix_lookup(self.state, self.prefix, 'rec_reseter'),
                name='{}_transition_{}'.format(self.prefix, level),
                **add_args))
{% endhighlight %}

没错，我们用的就是`RecurrentLayerWithSearch`，直奔主题，去看类`RecurrentLayerWithSearch`

{% highlight python %}
class RecurrentLayerWithSearch(Layer):
    #略略略
    def step_fprop(self,
                   state_below,
                   state_before,
                   gater_below=None,
                   reseter_below=None,
                   mask=None,
                   c=None,
                   c_mask=None,
                   p_from_c=None,
                   use_noise=True,
                   no_noise_bias=False,
                   step_num=None,
                   return_alignment=False):
        #略略略
        results = [h, ctx]
        if return_alignment:
            results += [probs]
        return results

{% endhighlight %}
这个`step_fprop(...)`函数重现了我们熟悉的 decoder的公式，我们也知道，这里面的`probs`就是 attention 的信息。到这里整个脉络就出来了，我们捋一捋

<img  src="{{ site.baseurl }}/images/alignbottom-up1.jpg" align="middle" height="675px" width="1010px" />

上图是与我们的目的相关的一个调用关系适宜，里面的代码都做了简化。只保留了函数名和类名。按照上述的调用关系，我们稍作修改就可以得到自己需要的返回结果了，我的思路是这样的：

<img  src="{{ site.baseurl }}/images/alignbottom-up2.jpg" align="middle" height="747px" width="1010px" />

上图绿色部分为增加的内容，修改后的完整代码在这里[encdec.py & sample.py][encdec.py&sample.py]，将链接中两个文件复制到 `GroundHog/experiments/nmt/` 路径下，执行 `python my_sample.py`（当然要训练好自己的模型并且配置好里面的路径喽），可以看到运行结果








<br /><font color="green">/******************************************  参考文线  *******************************************/</font><br />

1.<a id="bahdanau2014"/>Bahdanau, D., K. Cho & Y. Bengio (2014) Neural machine translation by jointly learning to align and translate. arXiv preprint arXiv:1409.0473.

2.<a id="groundhog"/>GroundHog: <a href="https://github.com/lisa-groundhog/GroundHog" target="_blank">https://github.com/lisa-groundhog/GroundHog</a>

[encdec.py&sample.py]: https://github.com/PolarLion/polarlion_post3_sources