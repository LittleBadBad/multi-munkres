# multi-munkres

基于 [匈牙利算法](https://en.wikipedia.org/wiki/Hungarian_algorithm) 的 [js实现](https://www.npmjs.com/package/munkres-js)
改进的多空槽的匈牙利算法，用于解决常用的根据空闲时间值班排班的问题

## 示例代码

- 成员排列
```javascript
const {multiMunres} = require('multi-munkres')
multiMunres([1, 1, 2, 1, 1],//每个空槽的人数
    [
        [0, 1, 0, 2, 3],//每个人对每个空槽的cost
        [0, 1, 2, 0, 3],
        [2, 1, 0, 1, 3]
    ],
    [2, 2, 3])//每个人能接受的最多空槽数
// => [ [ 0 ], [ 2 ], [ 2, 0 ], [ 1 ], [ 1 ] ]
// => [ 0 ], [ 0 ], [ 2 ], [ 1 ], [ 1 ] //每次执行会对人员列表shuffle，保证在cost相同的情况下有尽可能多的最优解
```

- cost计算

```javascript
const {calCost} = require('multi-munkres')
// res: 排列后的成员排列结果
// eachPerson: 每个成员对应每个空槽的cost
calCost(res,eachPerson)
```
