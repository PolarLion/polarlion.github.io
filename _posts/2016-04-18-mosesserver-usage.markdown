---
layout: post
title:  "关于 mosesserver 的使用"
location: 实验室
date:   2016-04-18 11:14:00 +0800
categories: jekyll update
---


　　无比强大的 moses 开源翻译工具毫无意外地提供了 server 的工作模式，
然而 mosesserver 的官方文档 [在这里：mosesserver 官方文档][mosesserver-doc] 完全是文字描述，没有代码，没有demo，有点反人类。（文档中确实提到有perl脚本，但是并没有在源代码里面找到T_T，不禁叫人吐槽 moses 的代码和注释质量远远超过文档），总而言之，想搞定它需要自己动手丰衣足食了。以下为使用 mosesserver 的一个简单的 python 实践......


<br /><font color="green">/************************************************** 废话分割线 ***************************************************/</font><br />

以下为正文，假设已经按照官方文档编译好了 moseseserver 的可执行文件

1. 同`bin/moses`使用方法一样，执行`bin/mosesserver`，执行时要比`bin/moses`执行时至少多两个参数：
   “`-server` ”和“ `-server-port XXXX` ”，其中`XXXX`就是端口号（以9999为例）。执行成功后，mosesserver 会在`0.0.0.0:9999` 这个地址提供server服务

2. 接下来就是客户端了，也是官方文档没有说明白的地方。看文档我们知道，mosesserver的服务是通过xmlrpc给出的，xmlrpc是一个请求格式，具体维基百科有说明 [请看这里：XML-RPC][XML-RPC]  

先敬上具体做法，首先是请求的数据格式：
<font color="blue">（假设要翻译的, 经过tokenization的句子是 “你好 普拉狮”）</font>


{% highlight pyhton %}

data = "<methodCall><methodName>translate</methodName>\
<params><param><value><struct><member><name>text</name>\
<value><string>你好 普拉狮</string></value></member>\
<member><name>align</name>\
<value><string>1</string></value></member>\
</struct></value></param></params></methodCall>"

{% endhighlight %}

上述代码是给python解释器去阅读的版本，翻译成人类喜闻乐见的格式是下面酱婶儿的：

{% highlight xml %}
<methodCall>
<methodName>translate</methodName>
<params><param>
  <value><struct>
    <member>
      <name>text</name>
      <value><string>你好 普拉狮</string></value>
    </member>
    <member>
      <name>align</name>
      <value><string>1</string></value>
    </member>
  </struct></value>
</param></params>
</methodCall>
{% endhighlight%}

　　按照moses官方文档的说法，顶层的 value 节点下的数据结构 struct 可以理解为一个 map，其中 name 为 text 的 member 节点提供希望翻译的内容信息，是必须包含的，下面 name 为 align 的 member 节点表示是否需要返回对齐信息，如果值为 0 或者不包含此 member 则 server端只返回翻译结果而不包含对齐信息。

接下来补完 python 的 demo：

{% highlight python %}
import urllib2
req = urllib2.Request("http://0.0.0.0:9999/RPC2")
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor()) 
# 发送请求并得到回复
response = opener.open(req, data)  
# res为回复的文本
res = response.read()
{% endhighlight %}

如果前面设置都没有问题，到这里我们已经得到了 mosesserver 返回的翻译结果了，在 res 中，是酱婶儿的：

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
<params><param><value>
<struct>
  <member>
    <name>align</name>
    <value><array><data>
    <value><struct>
      <member>
        <name>src-end</name>
        <value><i4>-1</i4></value></member>
      <member>
        <name>src-start</name>
        <value><i4>-1</i4></value></member>
      <member>
      	<name>tgt-start</name>
      	<value><i4>-1</i4></value></member>
    </struct></value>
    <value><struct>
      <member>
       <name>src-end</name>
       <value><i4>0</i4></value></member>
      <member>
      	<name>src-start</name>
      	<value><i4>0</i4></value></member>
      <member>
      	<name>tgt-start</name>
      	<value><i4>0</i4></value></member>
    </struct></value>
    <value><struct>
      <member>
        <name>src-end</name>
        <value><i4>1</i4></value></member>
      <member>
      	<name>src-start</name>
      	<value><i4>1</i4></value></member>
      <member>
      	<name>tgt-start</name>
      	<value><i4>1</i4></value></member>
    </struct></value>
    </data></array></value>
  </member>
  <member>
    <name>text</name>
    <value><string>hello |0-0| polarlion |1-1|</string></value>
  </member>
</struct>
</value></param></params>
</methodResponse>
{% endhighlight%}

　　返回的数据格式也是 xml，很长却也显而易见，其中名为 text 的一级 member 节点记录的是翻译结果的信息，名为 align 的一级 member 节点展示的是完整的对齐信息，如果在发送请求时没有包含 align，则返回的结果为：

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
<params><param><value>
<struct>
  <member>
    <name>text</name>
    <value><string>hello polarlion</string></value>
  </member>
</struct>
</value></param></params>
</methodResponse>
{% endhighlight%}

<br /><font color="green">/****************************************************  参考文线  *****************************************************/</font><br />


[mosesserver 官方文档: http://www.statmt.org/moses/?n=Advanced.Moses][mosesserver-doc]
<br />
[moses-support: http://comments.gmane.org/gmane.comp.nlp.moses.user/14283][moses-support]


[mosesserver-doc]: http://www.statmt.org/moses/?n=Advanced.Moses
[XML-RPC]: https://zh.wikipedia.org/wiki/XML-RPC
[moses-support]: http://comments.gmane.org/gmane.comp.nlp.moses.user/14283