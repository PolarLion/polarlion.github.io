---
layout: post
top: "false"
type: "tech"
title:  "SSH 远程端口转发<br>SSH port forwarding"
location: 东北老家
tag: "神经网络机器翻译 NMT"
categories: "tech"
date: 2017-02-20 12:00:00 +0800
---

## 应用场景

### 应用场景1
1.深度学习的模型通常运行在局域网（内网）的GPU服务器上。  
2.内网搭建的翻译系统只能在内网访问。  
3.需要在通过互联网访问内网的翻译系统。  

### 应用场景2
1.深度学习的模型通常运行在局域网（内网）的GPU服务器上。  
2.该服务器只能在内网访问（通过ssh连接）。  
3.需要在通过互联网访问内网的服务器。 


### 已有的设备条件
1.机器A: 内网GPU服务器，上面搭建了一个网页机器翻译系统，局域网内可访问；  
2.机器B: 内网中的个人电脑，可以连接到因特网，但无固定IP地址；  
3.机器C: 外网服务器，有固定的因特网IP地址，可以被机器B访问；  
4.机器X: 任何可以访问因特网的个人电脑。  

### 目标
以机器B作为桥梁，使得机器X通过机器C的IP地址试用在机器A上搭建的网页翻译系统。

### 重点
机器B可以通过SSH连接到机器C，但是机器C无法通过IP地址直接连接到机器B

## 解决方法
利用SSH反向连接和端口转发的功能  

### 要求
机器A,B,C均有SSH软件  

### 指令
1.假设机器C的外网IP地址为：22.22.33.33   用户名为 polarlion  做转发的端口为 2233  
2.假设机器A的内网IP地址为：233.233.233.233  
3.假设机器A的网页翻译的应用层协议采用http,（占用80端口）  

那么我们要做的就是利用B作为桥梁转发机器A端口80的信息  
在机器B运行下面指令：  

	ssh -R 2233:233.233.233:80 polarlion@22.22.33.33

对应的指令格式为：

	ssh -R C端口号:A内网地址:A端口号 C用户名@C外网地址

执行完这条指令之后，用浏览器访问外网地址 22.22.33.33:2233 时，就会得到 233.233.233.233:80 这个机器A的内网地址对应的页面  
如果想要在外网通过ssh连接到内网机器A的话，将 **80** 端口改为 **22** 即可


## 可能遇到的问题
别看指令很简单，短短一行，但是可能会遇到各种各样的问题哦！


在B上执行指令成功后，会要求输入用户名对应的密码，完成后如图：  

<figure align="left">
<img src="{{ site.baseurl }}/images/20170220a/1.jpg" align="middle"  width="635" height="80" />  
</figure >
<br />
这代表指令执行成功，但可能没有实现期许的功能

### 命令执行成功但无法访问 22.22.33.33:2233

首先要在外网机器C上通过下面指令查看网络监听情况

	netstat -antp


<figure align="left">
<img src="{{ site.baseurl }}/images/20170220a/2.jpg" align="middle"  width="882" height="369" />  
</figure >
<br />

从画红圈的地方我们发现，2233 这个端口监听的是 127.0.0.1 这个本机地址，这个地址是不能从外网访问的，解决办法是：  
将 ssh 的配置文件（通常是 `/etc/ssh/sshd_config` 路径），将 `GatewayPorts` 设置成 `yes` （如图）

<figure align="left">
<img src="{{ site.baseurl }}/images/20170220a/3.jpg" align="middle"  width="279" height="158" />  
</figure >
<br />

修改后通过超级用户权限重启 sshd 服务：

	sudo service sshd restart

重新在B上执行 `sshd -R ……` 的指令后，再在C上查看监听信息，如下图：

<figure align="left">
<img src="{{ site.baseurl }}/images/20170220a/4.jpg" align="middle"  width="895" height="174" />  
</figure >
<br />

从画红圈的地方可以看出已经打开了外网访问的监听


如果通过 `netstat -antp` 查看监听情况，确认 `0.0.0.0:2233` 监听启动之后，仍然无法访问，则有可能是防火墙阻碍了 2233 端口被外网访问，需要将此端口设置为防火墙例外。  
以 centos7 为例，执行：

	iptables -A INPUT -p tcp -m tcp --dport 2233 -j ACCEPT

这样就添加到防火墙例外了！


### 谷歌浏览器 ERR_UNSAFE_PORT 问题

谷歌浏览器 Chrome 对于一些端口号会限制访问，错误代码为 `ERR_UNSAFE_PORT`  
这个解决办法可以是更换其他端口号或者修改浏览器设置或者更换浏览器  
本文中的 `2233` 端口号是不会出现这个问题的  



<br /><font color="green">/******************************************  参考文线  *******************************************/</font><br />

  
ssh端口转发 <a href="https://www.ibm.com/developerworks/cn/linux/l-cn-sshforward">https://www.ibm.com/developerworks/cn/linux/l-cn-sshforward/</a>

防火墙例外 <a href="http://blog.51yip.com/linux/1404.html">http://blog.51yip.com/linux/1404.html</a>



