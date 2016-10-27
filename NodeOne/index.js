var http = require('http');
var fs = require('fs');  
var path = require('path');  
var mime = require('mime');  
var url = require('url');  
var cache = {};  
//配置开启缓存  
var cache_config = true;
http.createServer(function (request, response) {
	var filePath = false;  
    if(request.url == '/'){  
        filePath = 'view/register.html';  
    }else{  
        filePath = '.' + request.url;  
    }  
    serveStatic(response, cache, filePath);  
}).listen(8888);

//404错误处理  
function send404(response){  
    response.writeHead(404, {'Content-Type': 'text/plain'});  
    response.write('Error 404: Resource not found');  
    response.end();  
}  
//文件数据服务  
function sendFile(response, filePath, fileContents){  
    response.writeHead(200, {'Contet-Type': mime.lookup(path.basename(filePath))});  
    response.end(fileContents);  
} 


//静态文件服务  
function serveStatic(response, cache, absPath){  
    if(cache[absPath] && cache_config){  
        sendFile(response, absPath, cache[absPath]);  
    }else{  
        fs.exists(absPath, function(exists){  
            if(exists){  
                fs.readFile(absPath, function(err, data){  
                    if(err){  
                        send404(response);  
                    }else{  
                        cache[absPath] = data;  
                        sendFile(response, absPath, data);  
                    }  
                });  
            }else{  
                send404(response);  
            }  
        });  
    } 
}	