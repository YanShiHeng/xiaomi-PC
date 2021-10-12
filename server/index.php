<?php
header("Access-Control-Allow-Origin: *");//允许所有地址跨域请求
// 引入mysql文件
include('./mysql.php');
// 获取访问的方法
$fn = $_GET['fn'];
// add()  get() 
$fn();


// 获取数据的方法
function get(){
    $user = $_GET['user'];
    $pwd  =$_GET['pwd'];
    $checkType=$_GET['selectType'];//查询类型
    $sql = "select * from xiaomi";
    $flag=0;
    $res = select($sql);
    // print_r(json_encode($res));
    // print_r($res[0]);
    if ($checkType=='allCheck') {//登陆时全部查询
        for($i=0;$i<count($res);$i++){
            if($res[$i]['username']==$user&&$res[$i]['pw']==$pwd){
                $flag=1;
            }
        }
    }else{//注册时只查询用户名
        for($i=0;$i<count($res);$i++){
            if($res[$i]['username']==$user){
                $flag=1;
            }
        }
    }
    echo $flag;
}
//往数据库中添加数据
function add(){
    $user=$_GET['user'];
    $pwd=$_GET['pwd'];
    $sql="insert into xiaomi values(null,'$user','$pwd')";
    $res=query($sql);//添加成功则返回true
    echo $res;//$res为true时，echo输出为1
  }
?>