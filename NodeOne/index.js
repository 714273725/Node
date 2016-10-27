var http = require('http');
var fs = require('fs');  
var path = require('path');  
var mime = require('mime');  
var url = require('url');  
var cache = {};  
//���ÿ�������  
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

//404������  
function send404(response){  
    response.writeHead(404, {'Content-Type': 'text/plain'});  
    response.write('Error 404: Resource not found');  
    response.end();  
}  
//�ļ����ݷ���  
function sendFile(response, filePath, fileContents){  
    response.writeHead(200, {'Contet-Type': mime.lookup(path.basename(filePath))});  
    response.end(fileContents);  
} 


//��̬�ļ�����  
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