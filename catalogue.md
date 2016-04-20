---
layout: default
title: "普-目录"
permalink: /catalogue/
---
<!--specially for classification page-->
<br />
<br />
<div class="row">
<div class="col-sm-5 col-sm-offset-0">
  <h1><strong><font face="STKaiti" color="black">目录</font></strong></h1>
  <div class="categories">
    {% for ca in site.categories %}
      <li class="tags"><h3><font face="STKaiti" color="black">{{ ca | first }}</font> [<span>{{ ca | last | size }}]</span></h3>
      {% assign category =ca | first ) %}
        {% for post in site.categories[category] %}
        <font face="STKaiti" size="4"><a class="post-link" href="{{ site.baseurl }}{{ post.url }}">·{{ post.title }}</a></font>
        <!-- <div class="likids"><a class="post-link" href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></div> -->
        {% endfor %}
      </li>
    {% endfor %}
  </div>
</div>
<div class="col-sm-5 col-sm-offset-1">
  <h1><strong><font face="STKaiti" color="black">标签</font></strong></h1>
  <div>
    {% for tag in site.tags %}
      <li class="tags"><h3><font face="STKaiti" color="black">{{ tag  | first }}</font> [<span>{{ tag | last | size }}]</span></h3>
      {% assign t =tag | first ) %}
        {% for post in site.tags[t] %}
        <font face="STKaiti" size="4"><a class="post-link" href="{{ site.baseurl }}{{ post.url }}">·{{ post.title }}</a></font>
        {% endfor %}
      </li>
    {% endfor %}
  </div>
</div>
</div>



