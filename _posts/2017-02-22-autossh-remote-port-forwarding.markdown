---
layout: post
top: "false"
type: "tech"
title:  "AutoSSH 远程端口转发自动重连<br>AutoSSH port forwarding"
location: 北理的实验室
tag: "SSH 端口转发"
categories: "tech"
date: 2017-02-22 10:50:00 +0800
---


# SSH 远程端口转发自动重连
上一篇博客提到可以利用SSH的端口转发可以实现：通过中间机完成内网与外网的互联，这种连接方式的缺点之一是不太稳定，时不时的就会中断，会给远程操作带来一定的麻烦  
今天介绍利用 AutoSSH 实现自动重连的功能


## 应用场景
与上一篇一样，机器A在内网，机器C在外网，机器B处于内网但是可以连接到机器C，试图以B为中间机实现C访问A  
其中C的外网IP仍为 22.22.33.33
A的内网IP仍为 233.233.233.233


## 免密码登陆
想要自动重连，首先要解决输入密码的问题，因为之前介绍的方法每次连接都需要手动输入密码，很不方便，这里我们采用ssh提供的RSA验证的方法  
步骤：  
**1. 在机器C上生成公钥**  
在机器C输入：

	ssh-keygen

之后一直按回车就行，然后会在提示的目录下生成公钥
<figure align="left">
<img src="{{ site.baseurl }}/images/20170222a/1.jpg" align="middle"  width="608" height="476" />  
</figure >
<br />
**2. 将生成的公钥传到机器C**  
方法有多种，这里介绍最简单的指令，在机器C上运行：

	ssh-copy-id polarlion@22.22.33.33

指令格式为：

	ssh-copy-id <C's username>@<C's IP>

执行完会显示下面这些：  
<figure align="left">
<img src="{{ site.baseurl }}/images/20170222a/2.jpg" align="middle"  width="862" height="223" />  
</figure >
<br />
这个时候当然要去 check 一下了，运气好的可能就成功了，运气不好的可能会得到下面的报错信息：  
<figure align="left">
<img src="{{ site.baseurl }}/images/20170222a/3.jpg" align="middle"  width="471" height="60" />  
</figure >
<br />

解决办法很简单，只需要输入下面指令：  

	ssh-add ~/.ssh/id_rsa

指令格式为：  

	ssh-add path/to/id_rsa

执行之后在尝试一下，发现公钥生效了：  
<figure align="left">
<img src="{{ site.baseurl }}/images/20170222a/4.jpg" align="middle"  width="740" height="158" />  
</figure >
<br />

## autossh 自动重连
一行指令就搞定：

	autossh -M 5678 -R 2233:233.233.233.233:80 polarlion@22.22.33.33

这里比`ssh`指令多了一条`-M 5678`，含义为在机器B上利用端口`5678`监听连接状态，一旦断线就会自动重连

<figure align="left">
<img src="{{ site.baseurl }}/images/20170222a/5.jpg" align="middle"  width="720" height="136" />  
</figure >
<br />
<br /><font color="green">/******************************************  参考文线  *******************************************/</font><br />


autossh端口转发 <a href="http://www.cnblogs.com/eshizhan/archive/2012/07/16/2592902.html">http://www.cnblogs.com/eshizhan/archive/2012/07/16/2592902.html/</a>





