const UUID = "9f2c1a77-5c34-4b12-8c6d-8e4a52dcb921"
const SECRET_KEY = "x9K"

export default {

async fetch(request) {

const url = new URL(request.url)


// ===== 生成每日动态入口密钥 =====

const today = new Date()

const yyyy = today.getUTCFullYear()
const mm = String(today.getUTCMonth()+1).padStart(2,"0")
const dd = String(today.getUTCDate()).padStart(2,"0")

const dailyAdminKey = `${yyyy}${mm}${dd}${SECRET_KEY}`


// ===== 判断是否管理员入口 =====

const isAdminAccess =
url.search.includes(`admin=${dailyAdminKey}`)


// ===== 首页伪装逻辑 =====

if (url.pathname === "/" && !isAdminAccess) {

return new Response(galleryHTML,{
headers:{
"content-type":"text/html;charset=UTF-8"
}
})

}


// ===== 节点生成逻辑 =====

if (url.pathname === "/sub") {

const host = request.headers.get("host")

const node =

`vless://${UUID}@${host}:443?encryption=none&security=tls&type=ws&path=/assets#PhotoTunnel`

return new Response(node)

}


// ===== 默认返回主页 =====

return new Response("Not Found", { status:404 })

}

}


// ===== 高级摄影图库伪装页面 =====

const galleryHTML = `

<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">

<title>Photography Archive</title>

<style>

body{
margin:0;
background:#0e0e0e;
color:white;
font-family:-apple-system;
}

header{
padding:20px;
font-size:24px;
letter-spacing:2px;
border-bottom:1px solid #222;
display:flex;
justify-content:space-between;
}

nav span{
margin-right:20px;
cursor:pointer;
opacity:.6;
}

nav span:hover{
opacity:1;
}

.gallery{
column-count:4;
column-gap:10px;
padding:20px;
}

.card{
margin-bottom:10px;
position:relative;
cursor:pointer;
}

.card img{
width:100%;
border-radius:6px;
transition:.25s;
}

.card:hover img{
transform:scale(1.03);
}

.exif{
position:absolute;
bottom:10px;
left:10px;
font-size:12px;
opacity:.7;
}

.viewer{
position:fixed;
top:0;
left:0;
right:0;
bottom:0;
background:black;
display:none;
justify-content:center;
align-items:center;
flex-direction:column;
z-index:99;
}

.viewer img{
max-width:80%;
max-height:70%;
}

.viewer-info{
margin-top:15px;
font-size:14px;
opacity:.8;
}

.pagination{
text-align:center;
padding:20px;
}

button{
background:#222;
border:none;
color:white;
padding:10px 20px;
cursor:pointer;
border-radius:4px;
}

button:hover{
background:#444;
}

</style>

</head>

<body>

<header>

<div>Photography Archive</div>

<nav>

<span onclick="filter('all')">All</span>
<span onclick="filter('street')">Street</span>
<span onclick="filter('nature')">Nature</span>
<span onclick="filter('portrait')">Portrait</span>

</nav>

</header>

<div class="gallery" id="gallery"></div>

<div class="pagination">

<button onclick="loadMore()">Load More</button>

</div>

<div class="viewer" id="viewer" onclick="closeViewer()">

<img id="viewerImg">

<div class="viewer-info" id="viewerExif"></div>

</div>


<script>

const images=[]

const categories=["street","nature","portrait"]

for(let i=0;i<60;i++){

images.push({

src:"https://source.unsplash.com/random/800x"+(600+i),

cat:categories[i%3],

exif:"Sony A7M4 · 50mm · f/1."+((i%8)+2)+" · ISO "+(100+i)

})

}

let page=0
let filterMode="all"


function render(){

const gallery=document.getElementById("gallery")

const start=page*12

const subset=images
.filter(img=>filterMode=="all"||img.cat==filterMode)
.slice(start,start+12)

subset.forEach(img=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=

\`<img src="\${img.src}">
<div class="exif">\${img.exif}</div>\`

card.onclick=()=>openViewer(img)

gallery.appendChild(card)

})

}


function loadMore(){

page++

render()

}


function filter(mode){

document.getElementById("gallery").innerHTML=""

page=0

filterMode=mode

render()

}


function openViewer(img){

document.getElementById("viewer").style.display="flex"

document.getElementById("viewerImg").src=img.src

document.getElementById("viewerExif").innerText=img.exif

}


function closeViewer(){

document.getElementById("viewer").style.display="none"

}


render()

</script>

</body>

</html>

`