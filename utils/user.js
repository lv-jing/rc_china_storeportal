const wayList = ["微信", "短信", "邮件", "邮寄"];
const productList = ["金装巧克力礼盒", "松露形巧克力", "片装巧克力", "散装巧克力", "优选礼盒", "软冰淇淋", "限量季节新品", "热巧克力", "饼干/夹心糕点", "杯装冰淇淋/雪泥", "冰莹", "蛋糕", "咖啡", "巧克力条", "随享巧克力系列", "鲜制巧克力水果/干果"];
const activityList = ["巧克力学堂", "新品品鉴", "品牌活动", "私人定制"];

function getWayList () {
	return wayList;
}

function getProductList () {
	return productList;
}

function getActivityList () {
	return activityList;
}

export {
	getWayList,
	getProductList,
	getActivityList
}