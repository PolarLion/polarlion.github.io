---
layout: post
type: "tech"
title:  "结合注意力机制的神经机器翻译实例<br>An Example for Attention-based Neural Machine Translation"
location: 东北老家
tag: "神经网络机器翻译 NMT"
categories: "NMT"
date:   2017-02-10 08:45:00 +0800
---
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"></script>

本文将结合实例详细介绍结合注意力的神经机器翻译过程。以 <a href="#bahdanau2014">Bahdanau et al., 2014</a> 的工作为基础，并对此进行了简化（如将原文中使用的GRU替换成普通的RNN单元）以方便讲解，该工作同时公布了项目的**源代码**（<a href="https://github.com/lisa-groundhog/GroundHog/tree/master/experiments/nmt">https://github.com/lisa-groundhog/GroundHog/tree/master/experiments/nmt</a>），感兴趣的读者可以下载阅读并尝试运行。  
接下来，我们希望将下面的中文句子翻译成英文句子:  
<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/1.jpg" align="middle"  width="403" height="41" />  
</figure >

我们将利用简化后的结合注意力模型的神经机器翻译模型（<a href="#bahdanau2014">Bahdanau et al., 2014</a>）完成该任务。  
<br />

####**句子终结符（"\<eos\>"）**：
无论是编码器-解码器框架还是结合注意力机制的神经机器翻译，都需要句子终结符“告知”输入或输出的完成。所以，输入的源语言句子的结尾处需要附上终结符“**\<eos>**”，这样，输入的源语言序列变为： 
<figure align="center"> 
<img src="{{ site.baseurl }}/images/20160210nmtexample/2.jpg" align="middle"  width="479" height="45" />  
</figure>
<br />

####**词汇表（Vocabulary）**：
为了将中文句子转换为计算机可读的序列，需要将句子中每个单词用一个固定的整数常量替换。替换的规则依据构建模型时对应的词汇表，词表中每个词都有与之对应的唯一的整数编号。设源语言词汇表符号 \\(V\\),长度 \\(\|V\|=1000\\)（如图1）。  	

<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/3.jpg"  width="495" height="338" />
<figcaption><b>图 1 源语言词汇表与目标语言词汇表示例。</b></figcaption>
</figure>
<br />

依据上述词汇表替换后的源语言序列为：  

<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/4.jpg" align="middle"  width="490" height="30" />  
</figure>

<br />

####**独热编码（One-Hot Encoding）**：
为方便神经网络模型进行矩阵运算，要将上述整数转换为向量形式，通常采用独热编码的方法。独热编码将整数表示成维度等于词表长度的向量，其中需要编码的位置数值为1，其他位置数值为0。例如序列中第一个单词（整数编号11）的独热编码 \\(x_1 \\)为：  
<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/5.jpg" align="middle"  width="474" height="79" />
</figure>
<br />

依据上述规则，得到经过独热编码后的源语言序列 \\(x=\\{x_1,x_2,x_3,x_4,x_5,x_6,x_7\\}\\)。其中 \\(x_j∈R^{\|v\|}\\) 。
<br />
<br />

####**词向量（Word Vector）**：
词向量也称为词的分布式表示，在第四章神经网络语言模型中有过介绍。同神经网络语言模型类似，在神经机器翻译中也用到词向量作为编码器的输入（如图2）。  
词向量 \\(Ex_j\\)  计算方法为：  

$$ Ex_j=E^T∙{x_j}^T $$	  

其中 \\( E^T ∈ R^{m×\|V\|}\\)，\\(m\\) 为词向量维度，\\(m=150\\)，\\(\|V\|\\)为源语言词汇表长度，\\(\|V\|=1000\\) 。\\(E\\) 称为词向量矩阵。

<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/6.jpg" align="middle"  width="590" height="473" align="center"/>  
<figcaption><b>图 2 编码器</b></figcaption>
</figure>
<br />

####**双向RNN编码器（Bidirectional RNN encoder）**：
在7.5.2中已经介绍过，双向RNN编码器由正向传播和反向传播的两个独立的RNN组成（如图8），其中正向传播的RNN中，任意位置的隐层状态 h ⃗_j  计算方法为：

$$ 
\overrightarrow{h_j} =\left\{\begin{array}
\\tanh(\overrightarrow{W}∙Ex_j+\overrightarrow{U}∙\overrightarrow{h_{j-1}} ), \; if \; j>0\\
0, \; if \; j=0
\end{array}
\right.
$$

类似地，反向传播的RNN中，各个隐层状态的计算方法为：

$$
\overleftarrow{h_j} =\left\{\begin{array}
\\tanh(\overleftarrow{W}∙Ex_j+\overleftarrow{U}∙\overleftarrow{h_{j+1}}), \; if \; j<N_x\\
0, \; if \; j=N_x
\end{array}
\right.
$$

其中 \\(N_x=7\\) 为源语言序列长度，\\(\overrightarrow{W}, \overleftarrow{W} ∈ R^{n×m}\\)，\\(\overrightarrow{U}, \overleftarrow{U} ∈ R^{n×n}\\)。\\(n=500\\) 为隐藏层单元数。按照上述方法逐步迭代，得到 \\(\overrightarrow{h}=\\{\overrightarrow{h_1},…,\overrightarrow{h_{N_x}}\\}\\)  以及 \\(\overleftarrow{h}=\\{\overleftarrow{h_1},…,\overleftarrow{h_{N_x}}\\}\\)，将两个方向的隐层状态拼接： 

$$
h_i = \begin{bmatrix}
\overrightarrow{h_i} \\
\overleftarrow{h_i}
\end{bmatrix}
$$

可以得到 \\(h=\\{h_1,…,h_{N_x}\\}\\)，其中 \\(h_i∈R^{2n}\\)。
<br />
<br />

####**解码器（Decoder）**：
解码时，解码器按照目标语言的顺序依次生成目标语言单词（如图3）。设上下文向量 \\(c_i∈R^2n\\)，\\(E_y y_i\\)  为目标语言单词的向量表示，则解码器的隐藏层计算方法如下： 

$$
s_t=\left\{\begin{array}
\\tanh(W∙E_y y_{i-1}+U∙s_{i-1}+C∙c_i), \; if \; i>1 \\
tanh(U∙s_{i-1}+C∙c_i), \; if \; i=1 \\
W_s  h_1, \; if \; i=0
\end{array}
\right.
$$

其中，\\(W∈R^{n×m}\\)，\\(U∈R^{n×n}\\)，\\(C∈R^{n×2n}\\)。已知 \\(j\\) 时刻独热编码形式的目标语言单词 \\(y_j∈R^{\|V_y\|}\\) ，隐藏层状态 \\(s_j\\)，源语言上下文向量 \\(c_j\\)，则目标语言单词的估计概率

$$
p(y_i |s_i,y_(i-1),c_i )∝exp(y_i^T W_o t_i)\\
t_i=[max\{t_{i,2k-1},t_{i,2k}\}]_{k=1,..,l}^T\\
t_i=U_o∙s_i+V_o∙E_y y_{i-1}+C_o∙c_i	
$$

其中 \\(W_o∈R^{\|V_y\|×l}\\)，\\(U_o∈R^{2l×n}\\)，\\(C_o∈R^{2l×2n}\\)， \\(\|V_y\|=1000\\) 为目标语言词汇表 \\(V_y\\) 的长度。

<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/7.jpg" align="middle"  width="590" height="473" align="center"/>  
<figcaption align="center"><b>图 3 解码器</b></figcaption>
</figure>
<br />

####**注意力函数（Attentional Functions）**：
注意力函数是连接解码器和编码器的桥梁。解码器每一步运算需要的上下文向量{ c}_i  由注意力函数计算得到，计算方法如下：

$$
c_i=\sum_{j=1}^{N_x} α_{ij}h_j \\
α_{ij}=\frac{exp(e_{ij})}{∑_{k=1}^{N_x}exp(e_{ik})} \\
e_{ij}=V_a^T tanh(W_a∙s_{i-1}+U_a h_j )
$$

其中，\\(V_a∈R^{n^\prime}\\)，\\(W_a∈R^{n^\prime×n}\\)，\\(U_a∈R^{n^\prime×2n}\\)。从公式7.54可以看出，上下文向量c_i  由编码器各个隐层状态 \\(h=\\{h_1,…,h_{N_x}\\}\\) 加权求和得到。其中权重 \\(α_{ij}\\)  可理解为解码到第 \\(i\\) 个目标语言单词时，第 \\(j\\) 位置的源语言隐层状态对其的贡献值；亦可理解为目标语言中第 \\(i\\) 个目标语言单词的注意力或对齐到源语言第 \\(j\\) 位置的程度。若将整个解码过程中的 \\(α_{ij}\\) 输出，可以直观地看到上述的注意力（或对齐）信息。图4将其以灰度矩阵的形式表现出来，其中亮度越高的部分代表权重 \\(α_{tj}\\)  的值越高。
<figure align="center">
<img src="{{ site.baseurl }}/images/20160210nmtexample/8.jpg" align="middle"  width="326" height="343" align="center"/>  
<figcaption align="center"><b>图 4（占位）</b></figcaption>
</figure>
<br />

#未完待续
<br />
<br />


####**柱搜索（Beam Search）**：
在统计机器翻译中通常使用柱搜索来优化解码过程。由于本节介绍的神经机器翻译系统的解码过程是逐词输出的，且不考虑覆盖问题，故该搜索过程相对于统计机器翻译更为简化。
假设柱长度为3，即每次只保留3个搜索路径，且解码器每次需要输出概率最高的3个目标语言单词作为候选。

#未完待续









<br /><font color="green">/******************************************  参考文线  *******************************************/</font><br />


1.<a id="bahdanau2014" /> Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. 2015. Neural Machine Translation by Jointly Learning to Align and Translate. In Proceedings of ICLR.  
