# 关于mosesserver的使用


<br /> 
<p>moses开源翻译工具提供了server的工作模式，使用方法和参数与bin/moses大致一样，不同之处在于多了关于server属性的设置，具体利用“-help”参数就可以看到.这里不得不吐槽：moses的代码和注释写得比文档好。
<br />
言归正传，mosesserver的官方文档在这里[[mosesserver官方文档](http://www.statmt.org/moses/?n=Advanced.Moses)]是的，完全是文字描述的，没有代码，没有demo，让人不爽。（文档中确实提到了有perl脚本，但是我并没有找到T_T），总而言之，想搞定他需要自己动手丰衣足食了。
<br />
1. 同bin/moses使用方法一样，执行bin/moseserver，执行时要比moses执行时至少多两个参数：“-          server -server-port XXXX”，XXXX就是端口号（以9999为例）。执行成功后，moseser会在"0.0.0.0:9999" 这个地址提供server服务
2. 接下来就是客户端了，也是官方文档没有说明白的地方。看文档我们知道，moseserver的服务是通过xmlrpc给出的，xmlrpc是一个请求格式，具体维基百科有说明[[请看这里->XML-RPC](https://zh.wikipedia.org/wiki/XML-RPC)]
3. 具体做法我先敬上一段大家喜闻乐见的python代码吧：
<br />
首先是请求的数据格式：<br />
` data = "<methodCall><methodName>translate</methodName><params><param><value><struct><member><name>text</name><value><string>你好，普拉狮</string></value></member><member><name>align</name><value><string>1</string></value></member></struct></value></param></params></methodCall>"`
<br />上述是给python解释器读的版本，翻译成人类喜闻乐见的格式是下面酱婶儿的：<br />
![](data.jpg)
<br \>
接下来补完python的demo：
<br \>
` import urllib2
  req = urllib2.Request("http://0.0.0.0:9999/RPC2")
  opener = urllib2.build_opener(urllib2.HTTPCookieProcessor())  
  response = opener.open(req, data)  
  return response.read()`