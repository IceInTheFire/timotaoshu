###  小说列表接口

1、接口地址：/list

2、参数

| 参数名 | 参数类型 | 是否必填 | 备注 |
| :--- | :--- | :--- | :--- |
| isRandom | bool | 否 | 是否随机，若为true，则其他参数（除limit外）就不用填写了。 |
| page | int | 否 | 页数，默认1 |
| limit | int | 否 | 一页几条，默认10 |
| bookId | int | 否 | 小说Id |
| bookName | string | 否 | 小说名称，支持模糊搜索 |
| author | string | 否 | 小说作者，支持模糊搜索 |
| description | string | 否 | 小说描述，支持模糊搜索 |
| type | int | 否 | 爬取类型，不对外开放 |
| bookType | int | 否 | 小说类型 <br> 都市言情 <br> 言情小说 <br> 网游小说 <br> 具体详情参考 小说类型列表|
| bookStatus | int | 否 | 小说状态 。 <br> 1 连载 <br> 2 完本 |
| isJin | int | 否 | 是否禁用 <br> 1 启动 <br> 2 禁用|

3、接口返回结构

```js
data: {
    "count": 小说的数量
    "book": 小说的基本信息数组
}

```

4、接口返回例子

```js
{
  "code": 1000,
  "data": {
    "count": 181,
    "book": [
      {
        "id": 1102,
        "name": "《漂亮女医生的风雨爱情》",
        "author": "蓝箐",
        "description": "    三个女人，三朵花。一个热情如火，敢爱敢恨；一个文静温柔，善解人意；一个开朗洒脱，与众不同。这是发生在上个世纪九十年代的一段悲欢离合的爱情故事。她们从走出校门的那一天起，就注定今后的生活道路不可能是一帆风顺的。因为是临时工被人欺负，被人刁难，被世俗的眼光所不容，甚至因此失去工作和爱情。面对着这些突如其来的打击，她们迷茫过、退缩过，但是最终她们还是重新振作起来，毅然选择走上了一条艰苦的创业之路。在这条充满风风雨雨的艰难创业道路上，她们还能重新收获自己的爱情吗？\n",
        "reptileType": 1,
        "OriginUrl": "http://www.biquge.com.tw/15_15234/",
        "type": 3,
        "updateTime": "2017-12-31T16:00:00.000Z",
        "bookStatus": 2,
        "bookType": "都市小说",
        "isJin": 1
      },
      {
        "id": 1103,
        "name": "一念永恒",
        "author": "耳根",
        "description": "一念成沧海，一念化桑田。一念斩千魔，一念诛万仙。唯我念……永恒 ",
        "reptileType": 1,
        "OriginUrl": "http://www.biquge.com.tw/0_213/",
        "type": 3,
        "updateTime": "2018-05-29T16:00:00.000Z",
        "bookStatus": 1,
        "bookType": "修真小说",
        "isJin": 1
      }
    ]
  },
  "msg": ""
}
```

