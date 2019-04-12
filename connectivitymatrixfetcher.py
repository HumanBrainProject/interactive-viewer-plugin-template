from aiohttp import web
import aiohttp_cors
import json
import csv

def readcsv(filename):
    connectivity_matrix = {}
    input_file = csv.DictReader(open(filename))
    for row in input_file:
        connectivity_matrix[row['Name']] = {}
        for key, val in row.items():
            if key == 'Name':
                continue
            connectivity_matrix[row['Name']][key] = val       
    return connectivity_matrix    

async def return_auto_complete(request):
     return web.Response(status=200,content_type="application/json",body=dictAutocompleteString)

async def handle_post(request):
    if request.has_body:
        jsonobj = await request.json()
    else:
        return web.Response(status=400)
    print(jsonobj)
    filename = 'connectivityMat_'+jsonobj+'.csv'
    csv_dict = readcsv(filename)
    return web.Response(status=200,content_type="application/json",body=json.dumps(csv_dict))

def main():
    app = web.Application()
    cors = aiohttp_cors.setup(app)
    cors.add(app.router.add_post("/return_matrix",handle_post), {"*": aiohttp_cors.ResourceOptions(expose_headers="*", allow_headers="*")})
    cors.add(app.router.add_get("/",return_auto_complete), {"*": aiohttp_cors.ResourceOptions(expose_headers="*", allow_headers="*")})
    web.run_app(app,host="0.0.0.0",port=8003)

if __name__=='__main__':
    main()
