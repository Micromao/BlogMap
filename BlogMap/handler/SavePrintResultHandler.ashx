<%@ WebHandler Language="C#" Class="SavePrintResultHandler" %>

using System;
using System.Web;
using System.Data;
using System.IO;

public class SavePrintResultHandler : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        string url = context.Request.Params["resultUrl"].ToString();

        System.Net.HttpWebRequest req = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(url);
        req.Method = "GET";
        req.ServicePoint.Expect100Continue = false;
        req.Referer = context.Request.Headers["referer"];

        System.Net.WebResponse serverResponse = null;
        try
        {
            serverResponse = req.GetResponse();
        }
        catch (System.Net.WebException webExc)
        {
            context.Response.StatusCode = 500;
            context.Response.StatusDescription = webExc.Status.ToString();
            context.Response.Write(webExc.Response);
            context.Response.End();
            return;
        }
        
        if (serverResponse != null)
        {
            string[] urlSplit = url.Split('/');
            string fileName = urlSplit[urlSplit.Length - 1];
            string ext = fileName.Split('.')[1];
            
            Stream serverStream = serverResponse.GetResponseStream();

            string now = DateTime.Now.ToString("yyyyMMddHHmmss");
            string fn = now + "." + ext;

            int bufferSize = 2048;
            byte[] bytes = new byte[bufferSize];
            string filePath = context.Request.PhysicalApplicationPath + "download\\" + fn;
            FileStream fs = new FileStream(filePath, FileMode.Create);
            int length = serverStream.Read(bytes, 0, bufferSize);

            while (length > 0)
            {
                fs.Write(bytes, 0, length);
                length = serverStream.Read(bytes, 0, bufferSize);
            }
            serverStream.Close();
            fs.Close();
            serverResponse.Close();

            context.Response.Buffer = true;// 设置页面缓冲输出  
            context.Response.Clear();//清除缓冲区中的所有内容  
            //为输出流添加HTTP头信息,在这里用文件的名称作为下载的文件名称  
            context.Response.AddHeader("Content-Disposition", "attachment;filename=" + HttpUtility.UrlEncode(fn, System.Text.Encoding.UTF8) + ";");
            context.Response.ContentType = "application/octet-stream";
            System.IO.FileInfo finfo = new System.IO.FileInfo(filePath);
            context.Response.WriteFile(finfo.FullName);
            context.Response.Flush();

            finfo.Delete();//删除下载暂存到服务器的临时文件
            
            context.Response.End();
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}