---
layout: post
top: "true"
type: "tech"
title:  "[持续更新] 神经机器翻译论文汇总<br>Papers on Neural Machine Translation"
location: 东北老家
tag: "神经网络机器翻译 NMT"
categories: "NMT"
date: 2017-02-10 16:30:00 +0800
---

# 未完待续……

<br>
博主在这里尽可能地整理些神经机器翻译相关的重要论文，大概按照下面的条目分类，不同类别中有互相覆盖的~
另外作者根据 <b><font size="3">个人喜好</font>，<font size="4">个人喜好</font>，<font size="5">个人喜好</font></b> 给一些 **靠近知识树根节点的 or 开辟新领域的 or 实验超完整的 or 原作者公布源代码的 or 几乎终结某领域的** 论文打了星号（★）作为评分，评分从★到★★★  
<b><font size="5">对于不带★的文章，请综合参考文章出处、作者团队，并结合自身阅读体验做出评价！！</font></b>



<h2>目录</h2>
  - [<font size="4">主干</font>](#主干)
    1. [<font size="4">序列到序列学习 (sequence to sequence learning)</font>](#seq2seq)
    2. [<font size="4">学习对齐（后来普遍叫“注意力”机制）learning alignment (attention model)</font>](#attention)
  - [<font size="4">模型架构创新 New Model Architecture</font>](#模型架构创新)
  - [<font size="4">训练方法创新 New Training Strategy</font>](#训练方法创新)
  - [<font size="4">受限词表问题 Out-of-vocabulary problem</font>](#受限词表问题)
  - [<font size="4">词切片或字符级翻译 Sub-word or Character Level Translation</font>](#词切片或字符级翻译)
  - [<font size="4">多语言和低资源翻译 Multi/Low Resource Languages Translation</font>](#多语言和低资源翻译)
  - [<font size="4">模型可视化分析 Model Visualization/Analysing</font>](#模型可视化分析)



<h2 id="主干">主干</h2>

<h3 id="seq2seq">序列到序列学习 sequence to sequence learning</h3>
<span id="Sutskever2014" />**2014. Sequence to Sequence Learning with Neural Networks.**  
Ilya Sutskever, Oriol Vinyals, and Quoc V. Le. In Proceedings of NIPS.  
得分 ★★★  
**得分理由**：可谓万恶之源，虽然原作没公布源代码但是其他人实现的很多

<h3 id="attention">学习对齐（后来普遍叫“注意力”机制）learning alignment (attention model)</h3>
<span id="Bahdanau2015" />**2015. Neural Machine Translation by Jointly Learning to Align and Translate.**  
Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio.  In Proceedings of ICLR.  
得分 ★★★  
**得分理由**：可能这才是真的万恶之源，还公布了源代码


<h2 id="模型架构创新">模型架构创新 New Model Architecture</h2>
<span id="gehring2017" />**2017. Convolutional Sequence to Sequence Learning. ★★★**  
Jonas Gehring, Michael Auli, David Grangier, Denis Yarats, Yann N. Dauphin.  
<a herf="https://arxiv.org/abs/1705.03122">https://arxiv.org/abs/1705.03122</a>  
**得分理由**: CNN，更高的bleu，更快的速度。代码开源. <a herf="https://github.com/facebookresearch/fairseq">https://github.com/facebookresearch/fairseq</a>

<span id="Wang2016" />**2016. Memory-enhanced Decoder for Neural Machine Translation. ★**  
Mingxuan Wang, Zhengdong Lu, Hang Li, and Qun Liu. In Proceedings of EMNLP. 
**得分理由**：效果感人，神经图灵机 [[Graves et al., 2014](#graves2014)]

<span id="Meng2016" />2016. Interactive Attention for Neural Machine Translation.  
Fandong Meng, Zhengdong Lu, Hang Li, Qun Liu. Proceedings of COLING. 

<span id="Luong2015b" />2015. Effective Approaches to Attention-based Neural Machine Translation.  
Minh-Thang Luong Hieu Pham Christopher D. Manning. In Proceedings of EMNLP.

<h2 id="训练方法创新">训练方法创新 New Training Strategy</h2> 
<span id="bahdanau2017" />2017. An Actor-Critic Algorithm for Sequence Prediction  
Dzmitry Bahdanau, Philemon Brakel, Kelvin Xu, Anirudh Goyal, Ryan Lowe, Joelle Pineau, Aaron Courville, Yoshua Bengio.   
<a herf="https://arxiv.org/abs/1607.07086">https://arxiv.org/abs/1607.07086</a>

<span id="Tu2016" />2016. Neural Machine Translation with Reconstruction.   
Zhaopeng Tu, Yang Liu, Lifeng Shang, Xiaohua Liu, Hang Li. arXiv:1611.01874v2  
**得分理由**：效果感人，容易实现，实验充分

<span id="Shen2016" />**2016. Minimum Risk Training for Neural Machine Translation. ★**  
Shiqi Shen, Yong Cheng, Zhongjun He, Wei He, Hua Wu, Maosong Sun, and Yang Liu. In Proceedings of ACL.  
**得分理由**：有理有据，效果感人，ACL的的版本实验完整，发布顺序上的第一篇（先发表在 arXiv）

<span id="Cheng2016c" />2016. Semi-Supervised Learning for Neural Machine Translation.  
Yong Cheng, Wei Xu, Zhongjun He, Wei He, Hua Wu, Maosong Sun, and Yang Liu. In Proceedings of ACL.  

<span id="Zhou2016" />2016. Deep Recurrent Models with Fast-Forward Connections for Neural Machine Translation.  
Jie Zhou, Ying Cao, Xuguang Wang, Peng Li, Wei Xu. In Transactions of ACL.

<span id="Xia2016" />2016. Dual Learning for Machine Translation.  
Yingce Xia, Di He, Tao Qin, Liwei Wang, Nenghai Yu, Tie-Yan Liu, Wei-Ying Ma. NIPS.

<span id="Ranzato2016" />2016. Sequence Level Training with Recurrent Neural Networks.  
Marc’Aurelio Ranzato, Sumit Chopra, Michael Auli, and Wojciech Zaremba. In Proceedings of ICLR.  

<span id="Cheng2016b" />2016. Agreement-based Joint Training for Bidirectional Attention-based Neural Machine Translation.  
Yong Cheng, Shiqi Shen, Zhongjun He, Wei He, Hua Wu, Maosong Sun, Yang Liu. In Proceedings of IJCAI. 


<h2 id="受限词表问题">受限词表问题 Out-of-vocabulary problem</h2>
<span id="Luong2016" />2016. Achieving Open Vocabulary Neural Machine Translation with Hybrid Word-Character Models.  
Minh-Thang Luong and Christopher Manning. In Proceedings of ACL.

<span id="Li" />**2016. Towards Zero Unknown Word in Neural Machine Translation. ★**  
Xiaoqing Li, Jiajun Zhang, Chengqing Zong. In Proceedings of IJCAI.  
**得分理由**：首次关注了训练集上的 unk 问题！

<span id="Jean2015b" />2015. On Using Very Large Target Vocabulary for Neural Machine Translation.
Sébastien Jean, Kyunghyun Cho, Roland Memisevic, Yoshua Bengio. Proceedings of ACL.

<span id="Luong2015a" />2015. Addressing the Rare Word Problem in Neural Machine Translation.  
Minh-Thang Luong, Ilya Sutskever, Quoc V. Le, Oriol Vinyals, Wojciech Zaremba. In Proceedings of ACL.

<span id="Jean2015a" />2015. From Word Embeddings to Large Vocabulary Neural Machine Translation.  
Sébastien Jean. 

<h2 id="词切片或字符级翻译">词切片或字符级翻译 Sub-word or Character Level Translation</h2>
<span id="Lee2016" />**2016. Fully Character-Level Neural Machine Translation without Explicit Segmentation.  ★★**  
Jason Lee, Kyunghyun Cho, Thomas Hofmann. arXiv:1610.03017v2.  
**得分理由**：真·字符级别翻译！实验完整，甚至还尝试了多语言的翻译~

<span id="Johansen2016" />2016. Neural Machine Translation with Characters and Hierarchical Encoding.  
Alexander Rosenberg Johansen, Jonas Meinertz Hansen, Elias Khazen Obeid, Casper Kaae Sønderby, Ole Winther. arXiv:1610.06550.  

<span id="Wu2016" />**2016. Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation.  ★★★**  
Yonghui Wu, Mike Schuster, Zhifeng Chen, Quoc V. Le, Mohammad Norouzi, Wolfgang Macherey, Maxim Krikun, Yuan Cao, Qin Gao, Klaus Macherey, Jeff Klingner, Apurva Shah, Melvin Johnson, Xiaobing Liu, Łukasz Kaiser, Stephan Gouws, Yoshikiyo Kato, Taku Kudo, Hideto Kazawa, Keith Stevens, George Kurian, Nishant Patil, Wei Wang, Cliff Young, Jason Smith, Jason Riesa, Alex Rudnick, Oriol Vinyals, Greg Corrado, Macduff Hughes, Jeffrey Dean. 2016.  arXiv:1609.08144v2.  
**得分理由**：读起来似乎波澜不惊，去网页上试一试：以后写论文就靠它了。词切片（word piece）好用，实验完整

<span id="Luong2016" />2016. Achieving Open Vocabulary Neural Machine Translation with Hybrid Word-Character Models.  
Minh-Thang Luong and Christopher Manning. In Proceedings of ACL.  

<span id="Sennrich2016" />2016. Neural Machine Translation of Rare Words with Subword Units.  
Rico Sennrich, Barry Haddow, and Alexandra Birch. In Proceedings of ACL.  

<span id="Chung2016" />2016. A Character-Level Decoder without Explicit Segmentation for Neural Machine Translation.  
Junyoung Chung, Kyunghyun Cho, and Yoshua Bengio. In Proceedings of ACL.  


<h2 id="多语言和低资源翻译">多语言和低资源翻译 Multi/Low Resource Languages Translation</h2>
<span id="Cheng2016a" />2016. Neural Machine Translation with Pivot Languages  
Yong Cheng, Yang Liu, Qian Yang, Maosong Sun, Wei Xu. arXiv:1611.04928.

<span id="Johnson2016" />**2016. Google's Multilingual Neural Machine Translation System: Enabling Zero-Shot Translation.  ★★**  
Melvin Johnson, Mike Schuster, Quoc V. Le, Maxim Krikun, Yonghui Wu, Zhifeng Chen, Nikhil Thorat, Fernanda Viégas, Martin Wattenberg, Greg Corrado, Macduff Hughes, Jeffrey Dean. arXiv:1611.04558.  
**得分理由**：几乎原封不动地拿 GNMT 直接做多语言，真正意义上的多语言神经机器翻译：不但共享参数还共享词表！效果令人惊叹，实验完整到令人发指

<span id="Zoph2016" />2016. Transfer Learning for Low-Resource Neural Machine Translation.  
Barret Zoph, Deniz Yuret, Jonathan May, and Kevin Knight. In Proceedings of EMNLP.

<span id="Firat2016b" />2016. Zero-Resource Translation with Multi-Lingual Neural Machine Translation.  
Orhan Firat, Baskaran Sankaran, Yaser Al-Onaizan, Fatos T. Yarman Vural, Kyunghyun Cho.  In Proceedings of EMNLP.

<span id="Firat2016a" />**2016. Multi-Way, Multilingual Neural Machine Translation with a Shared Attention Mechanism.   ★★**  
Orhan Firat, Kyunghyun Cho, Yoshua Bengio. arXiv:1601.01073.  
**得分理由**：第一个发表的做多语言翻译的工作，开启了新世界的大门



<h2 id="模型可视化分析">模型可视化分析 Model Visualization/Analysing</h2>
<span id="ding2017" />2017. Visualizing and Understanding Neural Machine Translation  
Yanzhuo Ding, Yang Liu, Huanbo Luan, Maosong Sun. 
In Proceedings of ACL 2017.


<span id="belinkov2017" />2017. What do Neural Machine Translation Models Learn about Morphology?  
Yonatan Belinkov, Nadir Durrani, Fahim Dalvi, Hassan Sajjad, James Glass
In Proceedings of ACL 2017.

<br /><font color="green">/******************************************  参考文线  *******************************************/</font><br />

  

1.<a id="graves2014" /> Alex Graves, Greg Wayne, and Ivo Danihelka. 2014. Neural Turing Machines. arXiv:1410.5401v2.  
 


