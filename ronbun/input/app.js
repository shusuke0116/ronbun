const express = require("express");
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('test.db');

app.set('view engine', 'ejs');
app.use("/public", express.static("public"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render('top'); 
});

app.get("/question/1/:count", (req, res) => {

  let textdata;
  let col = new Array(3);
  //回数を数える
  var prev1 = 0;
  var prev2 = 0;
  var count = Number(req.params.count);
  //console.log(count);
  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 1"
    + ";";
  
  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      textdata = data;
    })
  })

  //　選択肢
  let sqlb = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 1"
    + ";";
  
  db.serialize( () => {
    db.all(sqlb, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(choices); 
      col[0] = choices[0].ccode;
      res.render('layout_1a', {e:0,textdata:textdata,choices:choices,col:col,count:count,prev1:prev1,prev2:prev2});
    })
  })
});

app.post("/question/1/answer", (req, res) => {

  let textdata;
  let gb;
  let col = new Array(5);
  var count = Number(req.body.count);
  var prev1 = Number(req.body.prev1);
  var prev2 = Number(req.body.prev2);

  // 選択された色のカラーコード
  let sql = "select name,ccode,pcode,dcode,scode"
    + " from color" 
    + " where id = " + req.body.choice
    + ";";
  
  db.serialize( () => {
    db.all(sql, (error, cho) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      col[0] = cho[0].ccode;
      col[1] = cho[0].pcode;
      col[2] = cho[0].dcode;
      col[3] = cho[0].scode;
      col[4] = cho[0].name;
    })
  })

  //選択された色の評価
  let sqla = "select gb"
    + " from eva" 
    + " where cola = 1" 
    + " and colb = " + req.body.choice
    + ";";
  
  db.serialize( () => {
    db.all(sqla, (error, eva) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      gb = eva[0].gb;
      if(gb == 1){
        if(prev1 != req.body.choice && prev2 != req.body.choice){
          count += 1;
          prev2 = prev1;
          prev1 = req.body.choice;
        }
      }
      //console.log("prev1:"+prev1);
      //console.log("count:"+count);
    })
  })

  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 1"
    + ";";
  
  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);  
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 1"
    + ";";
    
  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      res.render('layout_1a', {e:1,textdata:textdata,choices:choices,col:col,gb:gb,count:count,prev1:prev1,prev2:prev2});
    })
  })
});

app.get("/question/2/:col", (req, res) => {

  let textdata;
  let col = [req.params.col,""];
  let fon;

  // テキスト
  let sqlb = "select id,item,que"
    + " from text"
    + " where text.id = 2"
    + ";";
    
  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);   
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select *" 
    + " from font" 
    + ";";
    
  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(choices);
      fon = choices[0].face;
      res.render('layout_1b', {e:0,textdata:textdata,choices:choices,col:col,fon:fon});
    })
  })
});

app.post("/question/2/answer", (req, res) => {

  let textdata;
  let col = new Array(2);
  let fon = req.body.choice;
  let gb;

  // 選択されていた色のカラーコード
  let sql = "select ccode,pcode"
    + " from color" 
    + " where ccode = '"+ req.body.col + "'"
    + ";";
    
  db.serialize( () => {
    db.all(sql, (error, cho) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      col[0] = cho[0].ccode;
      col[1] = cho[0].pcode;
    })
  })

  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 2"
    + ";";
    
  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);    // ③
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select *" 
    + " from font" 
    + ";";
    
  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      for(i=0;i<choices.length;i++){
        if(choices[i].face == fon) gb = choices[i].gb;
      }
      res.render('layout_1b', {e:1,textdata:textdata,choices:choices,col:col,fon:fon,gb:gb});
    })
  })
});

app.get("/question/3/:col", (req, res) => {

  let col = [req.params.col,""];

  // テキスト
  let sqlb = "select id,item,que"
    + " from text"
    + " where text.id = 3"
    + ";";
    
  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);  
      res.render('layout_1c', {e:0,textdata:data,col:col,li:"",bo:"",ch:["",""]});
    })
  })
});

app.post("/question/3/answer", (req, res) => {

  let col = new Array(2);
  let gb;
  let ch = new Array(2);
  let li;
  let bo;

  if(req.body.line == 1 ){
    ch[0] = "checked";
    li = "underline";
    gb = 1;
  } else{
    ch[0] = "";
    li = "none";
    gb = 0;
  }
  if(req.body.bold == 1 ){
    ch[1] = "checked";
    bo = "bold";
  } else{
    ch[1] = "";
    bo = "normal";
    gb = 0;
  }

  // 選択されていた色のカラーコード
  let sql = "select ccode,pcode"
    + " from color"
    + " where ccode = '"+ req.body.col + "'"
    + ";";
    
  db.serialize( () => {
    db.all(sql, (error, eva) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      col[0] = eva[0].ccode;
      col[1] = eva[0].pcode;
    })
  })

  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 3"
    + ";";
    
  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);   
      res.render('layout_1c', {e:1,textdata:data,col:col,gb:gb,li:li,bo:bo,ch:ch});
    })
  })
});

app.get("/question/4/:bcol/:count", (req, res) => {

  let textdata;
  let col = new Array(3);
  let bcol =  [req.params.bcol,""];
  let backid = new Array(2);;
  //回数を数える
  var prev1 = 0;
  var prev2 = 0;
  var count = Number(req.params.count);

  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 4"
    + ";";
  
  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      textdata = data;
    })
  })

  //背景色のid
  let sqla = "select id,name" 
    + " from color"
    + " where ccode = '" + bcol[0] + "'"
    + ";";

  db.serialize( () => {
    db.all(sqla, (error, back) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      backid[0] = back[0].id;
      backid[1] = back[0].name;
    })
  })
  //　選択肢
  let sqlb = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 4"
    + " and color.ccode != '" + bcol[0] + "'"
    + ";";
  
  db.serialize( () => {
    db.all(sqlb, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(choices); 
      col[0] = choices[0].ccode;
      res.render('layout_2a', {e:0,textdata:textdata,choices:choices,col:col,bcol:bcol,backid:backid,count:count,prev1:prev1,prev2:prev2});
    })
  })
});

app.post("/question/4/answer", (req, res) => {

  let textdata;
  let gb;
  let backid = req.body.backid;
  let col = new Array(5);
  let bcol = new Array(4);
  var count = Number(req.body.count);
  var prev1 = Number(req.body.prev1);
  var prev2 = Number(req.body.prev2);
  
  // 選択された色のカラーコード
  let sql = "select name,ccode,pcode,dcode,scode"
    + " from color" 
    + " where id = " + req.body.choice
    + ";";
  
  db.serialize( () => {
    db.all(sql, (error, cho) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      col[0] = cho[0].ccode;
      col[1] = cho[0].pcode;
      col[2] = cho[0].dcode;
      col[3] = cho[0].scode;
      col[4] = cho[0].name;
    })
  })

  // 背景色のカラーコード
  let sqld = "select ccode,pcode,dcode,scode"
    + " from color" 
    + " where ccode = '" + req.body.bcol + "'"
    + ";";

  db.serialize( () => {
    db.all(sqld, (error, chob) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      bcol[0] = chob[0].ccode;
      bcol[1] = chob[0].pcode;
      bcol[2] = chob[0].dcode;
      bcol[3] = chob[0].scode;
    })
  })

  //選択された色の評価
  let sqla = "select gb"
    + " from eva" 
    + " where (cola = " + backid + " and colb = " + req.body.choice + ")" 
    + " or (cola = " + req.body.choice + " and colb = " + backid + ")"
    + ";";
  
  db.serialize( () => {
    db.all(sqla, (error, eva) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      gb = eva[0].gb;
      if(gb == 1){
        if(prev1 != req.body.choice && prev2 != req.body.choice){
          count += 1;
          prev2 = prev1;
          prev1 = req.body.choice;
        }
      }
      //console.log("prev1:"+prev1);
      //console.log("count:"+count);
    })
  })

  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 4"
    + ";";
  
  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);  
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 4"
    + " and color.id != " + backid 
    + ";";
    
  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      res.render('layout_2a', {e:1,textdata:textdata,choices:choices,col:col,bcol:bcol,gb:gb,backid:backid,count:count,prev1:prev1,prev2:prev2});
    })
  })
});

app.get("/question/5/:bcol", (req, res) => {

  let textdata;
  let col = new Array(3);
  let bcol =  [req.params.bcol,""];
  let backid;

  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 5"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      textdata = data;
    })
  })

  //背景色のid

  let sqla = "select id" 
    + " from color"
    + " where ccode = '" + bcol[0] + "'"
    + ";";

  db.serialize( () => {
    db.all(sqla, (error, back) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      backid = back[0].id;
    })
  })
  //　選択肢
  let sqlb = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 5"
    + " and color.ccode != '" + bcol[0] + "'"
    + ";";

  db.serialize( () => {
    db.all(sqlb, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(choices); 
      col[0] = choices[0].ccode;
      res.render('layout_2b', {e:0,textdata:textdata,choices:choices,col:col,bcol:bcol,backid:backid});
    })
  })
});

app.post("/question/5/answer", (req, res) => {

  let textdata;
  let gb;
  let backid = req.body.backid;
  let col = new Array(5);
  let bcol = new Array(4);

  // 選択された色のカラーコード
  let sql = "select name,ccode,pcode,dcode,scode"
    + " from color" 
    + " where id = " + req.body.choice
    + ";";

  db.serialize( () => {
    db.all(sql, (error, cho) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      col[0] = cho[0].ccode;
      col[1] = cho[0].pcode;
      col[2] = cho[0].dcode;
      col[3] = cho[0].scode;
      col[4] = cho[0].name;
    })
  })

  // 背景色のカラーコード
  let sqld = "select ccode,pcode,dcode,scode"
    + " from color" 
    + " where ccode = '" + req.body.bcol + "'"
    + ";";

  db.serialize( () => {
    db.all(sqld, (error, chob) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      bcol[0] = chob[0].ccode;
      bcol[1] = chob[0].pcode;
      bcol[2] = chob[0].dcode;
      bcol[3] = chob[0].scode;
    })
  })

  //選択された色の評価
  let sqla = "select gb"
    + " from eva" 
    + " where (cola = " + backid + " and colb = " + req.body.choice + ")" 
    + " or (cola = " + req.body.choice + " and colb = " + backid + ")"
    + ";";

  db.serialize( () => {
    db.all(sqla, (error, eva) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      gb = eva[0].gb;
    })
  })

  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 5"
    + ";";

  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);  
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 5"
    + " and color.id != " + backid 
    + ";";

  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      res.render('layout_2b', {e:1,textdata:textdata,choices:choices,col:col,bcol:bcol,gb:gb,backid:backid});
    })
  })
});

app.get("/question/6/:bcol", (req, res) => {

  let textdata;
  let col = new Array(3);
  let bcol =  [req.params.bcol,""];
  let backid;

  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 6"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      textdata = data;
    })
  })

  //背景色のid

  let sqla = "select id" 
    + " from color"
    + " where ccode = '" + bcol[0] + "'"
    + ";";

  db.serialize( () => {
    db.all(sqla, (error, back) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      backid = back[0].id;
    })
  })
  //　選択肢
  let sqlb = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 6"
    + " and color.ccode != '" + bcol[0] + "'"
    + ";";

  db.serialize( () => {
    db.all(sqlb, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(choices); 
      col[0] = choices[0].ccode;
      res.render('layout_2c', {e:0,textdata:textdata,choices:choices,col:col,bcol:bcol,backid:backid});
    })
  })
});

app.post("/question/6/answer", (req, res) => {

  let textdata;
  let gb;
  let backid = req.body.backid;
  let col = new Array(5);
  let bcol = new Array(4);

  // 選択された色のカラーコード
  let sql = "select name,ccode,pcode,dcode,scode"
    + " from color" 
    + " where id = " + req.body.choice
    + ";";

  db.serialize( () => {
    db.all(sql, (error, cho) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      col[0] = cho[0].ccode;
      col[1] = cho[0].pcode;
      col[2] = cho[0].dcode;
      col[3] = cho[0].scode;
      col[4] = cho[0].name;
    })
  })

  // 背景色のカラーコード
  let sqld = "select ccode,pcode,dcode,scode"
    + " from color" 
    + " where ccode = '" + req.body.bcol + "'"
    + ";";

  db.serialize( () => {
    db.all(sqld, (error, chob) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      bcol[0] = chob[0].ccode;
      bcol[1] = chob[0].pcode;
      bcol[2] = chob[0].dcode;
      bcol[3] = chob[0].scode;
    })
  })

  //選択された色の評価
  let sqla = "select gb"
    + " from eva" 
    + " where (cola = " + backid + " and colb = " + req.body.choice + ")" 
    + " or (cola = " + req.body.choice + " and colb = " + backid + ")"
    + ";";

  db.serialize( () => {
    db.all(sqla, (error, eva) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      gb = eva[0].gb;
    })
  })

  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 6"
    + ";";

  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);  
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 6"
    + " and color.id != " + backid 
    + ";";

  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      res.render('layout_2c', {e:1,textdata:textdata,choices:choices,col:col,bcol:bcol,gb:gb,backid:backid});
    })
  })
});

app.get("/question/7", (req, res) => {
  let textdata;
  let col = [["FF0000",""],["008000",""],["0000FF",""]];
  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 7"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      textdata = data;
    })
  })

  //　選択肢
  let sqlb = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 7"
    + ";";

  db.serialize( () => {
    db.all(sqlb, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(choices); 
      res.render('layout_3a', {e:0,textdata:textdata,choices:choices,col:col});
    })
  })
});

app.post("/question/7/answer", (req, res) => {

  let textdata;
  let gb = 1;
  let id = [req.body.s0,req.body.s1,req.body.s2];
  let col = [[],[],[]];
  // 選択された色のカラーコード
  let s = "select name,ccode,pcode,dcode,scode"
    + " from color" 
    + " where id = ";

  let sqls = [ s+id[0]+";" , s+id[1]+";" , s+id[2]+";" ];

  let i = 0;
  for(let sql of sqls){
    db.serialize( () => {
      db.all(sql, (error, data) => {
        if( error ) {
          return res.render('show', {mes:"エラーです"});
        }
        col[i][0] = data[0].ccode;
        col[i][1] = data[0].pcode;
        col[i][2] = data[0].dcode;
        col[i][3] = data[0].scode;
        col[i][4] = data[0].name;
        i++;
        //console.log(col);
      })
    })
  }
  
  //選択された色の評価
  var sqla = new Array();
  var a;
  for(let j=0;j<2;j++){
    for(let k=j+1;k<3;k++){
      a = "select gb"
      + " from eva" 
      + " where (cola = " + id[j] + " and colb = " + id[k] + ")" 
      + " or (cola = " + id[k] + " and colb = " + id[j] + ")"
      + ";";
      sqla.push(a);
    }
  }
  for(let sql of sqla){
    db.serialize( () => {
      db.all(sql, (error, eva) => {
        if( error ) {
          return res.render('show', {mes:"エラーです"});
        }
        if(eva[0].gb == 0){
          gb = 0;
        }
      })
    })
  }
  
  // テキスト
  let sqlb = "select *"
    + " from text"
    + " where text.id = 7"
    + ";";

  db.serialize( () => {
    db.all(sqlb, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);  
      textdata = data;
    })
  })

  //　選択肢
  let sqlc = "select color.id,color.name,ccode" 
    + " from tc inner join color" 
    + " on (color.id=tc.c_id)"
    + " where t_id = 7"
    + ";";

  db.serialize( () => {
    db.all(sqlc, (error, choices) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      res.render('layout_3a', {e:1,textdata:textdata,choices:choices,col:col,gb:gb});
    })
  })
});

app.get("/question/8/:col", (req, res) => {
  
  let col = [[req.params.col.substr(0,6),""],[req.params.col.substr(6,6),""],[req.params.col.substr(12,6),""]];
  let check = new Array(6).fill(["checked","",""]);
  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 8"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      res.render('layout_3b', {e:0,textdata:data,col:col,check:check});
    })
  })
});

app.post("/question/8/answer", (req, res) => {
  let col = [[req.body.a0s0,""],[req.body.a0s1,""],[req.body.a0s2,""]];
  let check = [["","",""],["","",""],["","",""],["","",""],["","",""],["","",""]];
  let c = [req.body.s0c0,req.body.s1c0,req.body.s2c0,req.body.s0c1,req.body.s1c1,req.body.s2c1];
  let gb = 1;
  //console.log(c);
  
  //チェックされた場所
  for(let i=0;i<6;i++){
    check[i][c[i]] = "checked";
  }
  //console.log(check);
  //評価（線の種類）
  for(let i=0;i<3;i++){
    for(let j=i+1;j<3;j++){
      if(c[i] == c[j]){
        gb = 0;
        break;
      }
    }
  }
  
  //評価（ポイントの図形）
  for(let i=3;i<6;i++){
    for(let j=i+1;j<6;j++){
      if(c[i] == c[j]){
        gb = 0;
        break;
      }
    }
  }
  
  //カラーコード
  let s = "select pcode"
    + " from color" 
    + " where ccode = '";

  let sqls = [ s+req.body.a0s0+"';" , s+req.body.a0s1+"';" , s+req.body.a0s2+"';" ];
  let i = 0;
  for(let sql of sqls){
    db.serialize( () => {
      db.all(sql, (error, data) => {
        if( error ) {
          return res.render('show', {mes:"エラーです"});
        }
        col[i][1] = data[0].pcode;
        i++;
        //console.log(col);
      })
    })
  }
  
  // テキスト
  let sql = "select *" 
    + " from text"
    + " where text.id = 8"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      res.render('layout_3b', {e:1,textdata:data,col:col,check:check,gb:gb,c:c});
    })
  })
});

app.get("/question/9/:col/:mark", (req, res) => {

  let col = [[req.params.col.substr(0,6),""],[req.params.col.substr(6,6),""],[req.params.col.substr(12,6),""]];
  let check = ["checked",""];
  let mark = [req.params.mark.substr(0,1),req.params.mark.substr(1,1),req.params.mark.substr(2,1),req.params.mark.substr(3,1),req.params.mark.substr(4,1),req.params.mark.substr(5,1)];
  //console.log(col);
  //console.log(mark);
  
  // テキスト
  let sql = "select id,item,que" 
    + " from text"
    + " where text.id = 9"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      res.render('layout_3c', {e:0,textdata:data,col:col,check:check,mark:mark});
    })
  })
});

app.post("/question/9/answer", (req, res) => {
  let col = [[req.body.a0s0,""],[req.body.a0s1,""],[req.body.a0s2,""]];
  let check = ["",""];
  let mark = [req.body.m0,req.body.m1,req.body.m2,req.body.m3,req.body.m4,req.body.m5];
  let gb;

  //評価
  if(req.body.c0 == "right"){
    gb = 1;
    check[1] = "checked";
  }else{
    gb = 0;
    check[0] = "checked";
  }

  //カラーコード
  let s = "select pcode"
    + " from color" 
    + " where ccode = '";

  let sqls = [ s+req.body.a0s0+"';" , s+req.body.a0s1+"';" , s+req.body.a0s2+"';" ];
  let i = 0;
  for(let sql of sqls){
    db.serialize( () => {
      db.all(sql, (error, data) => {
        if( error ) {
          return res.render('show', {mes:"エラーです"});
        }
        col[i][1] = data[0].pcode;
        i++;
        //console.log(col);
      })
    })
  }

  // テキスト
  let sql = "select *" 
    + " from text"
    + " where text.id = 9"
    + ";";

  db.serialize( () => {
    db.all(sql, (error, data) => {
      if( error ) {
        res.render('show', {mes:"エラーです"});
      }
      //console.log(data);
      res.render('layout_3c', {e:1,textdata:data,col:col,check:check,mark:mark,gb:gb});
    })
  })
});

app.use(function(req, res, next) {
  res.status(404).send('ページが見つかりません');
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
