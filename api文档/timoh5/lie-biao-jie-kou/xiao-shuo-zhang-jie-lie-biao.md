### 小说章节列表接口

1、接口地址：/catalogList

2、参数

| 参数名 | 参数类型 | 是否必填 | 备注 |
| :--- | :--- | :--- | :--- |
| bookId | int | 是 | 小说ID |
| page | int | 否 | 页数，默认1 |
| limit | int | 否 | 一页几条，默认10 |

3、接口返回结构

```js
data: {
    "count": 该小说有多少章节,
    "catalog": [
        {
           "id": 12794,
            "bookId": 1102,
            "name": "第1章女自费生的烦恼",
            "num": 0,
            "type": 1,
            "createTime": "2018-05-01T06:57:18.000Z",
            "updateTime": "2018-05-01T06:57:18.000Z",
            "isJin": 2,
            "isReptileTool": 2,
            "reptileAddress": null
        }
    ]
}
```

4、接口返回例子

```js
{
  "code": 1000,
  "data": {
    "count": 322,
    "catalog": [
      {
        "id": 12794,
        "bookId": 1102,
        "name": "第1章女自费生的烦恼",
        "num": 0,
        "type": 1,
        "createTime": "2018-05-01T06:57:18.000Z",
        "updateTime": "2018-05-01T06:57:18.000Z",
        "isJin": 2,
        "isReptileTool": 2,
        "reptileAddress": null
      }
    ]
  },
  "msg": ""
}
```



