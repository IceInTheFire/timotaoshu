### 批量小说列表接口

1、接口地址：/listBatch

2、参数

| 参数名 | 参数类型 | 是否必填 | 备注 |
| :--- | :--- | :--- | :--- |
| type | int | 是 | 1、bookIds  <br>     2、bookNames |
| bookIds | string | type为1时，该参数必填 <br> type为2时，该参数无效 | 批量小说id <br>例： 1,2,3,4,5,6 |
| bookNames | string | type为1时，该参数无效 <br> type为2时，该参数必填 | 批量小说名称,不支持模糊查询<br>例：斗破苍穹，武动乾坤 |



3、接口返回结构

```js
data: {
    "count":批量查询到的小说数量,
    "book": [
        小说的基本信息,
        { //接口参数type为1时，查询不到的id
            "id": 1104,
            "msg": "没有此书"
        },
        {    //接口参数type为1时，查询不到的书名
            "id": "完结天尊",
            "msg": "没有此书"
        }
    ]
}

```

4、接口返回例子（接口参数type为1时）

```js
{
  "code": 1000,
  "data": {
    "count": 2,
    "book": [
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
      },
      {
        "id": 1104,
        "msg": "没有此书"
      }
    ]
  },
  "msg": ""
}
```
5、接口返回例子2（接口参数type为2时）
```js
{
  "code": 1000,
  "data": {
    "count": 1,
    "book": [
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
      },
      {
        "id": "完结天尊",
        "msg": "没有此书"
      }
    ]
  },
  "msg": ""
}
```



