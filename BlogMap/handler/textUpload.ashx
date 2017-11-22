<%@ WebHandler Language="C#" Class="Upload" %>
using System;
using System.Web;
using System.IO;
using System.Web.Script.Serialization;
using System.Collections;
using System.Collections.Generic;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Xml;
using System.Data;
using System.Text;
public class Upload : IHttpHandler {
    public void ProcessRequest (HttpContext context) {
        try
        {
            int iTotal = context.Request.Files.Count;
            if (iTotal == 0)
                return;
            HttpPostedFile file = context.Request.Files[0];
            int len = file.ContentLength;
            if (len > 0 && !string.IsNullOrEmpty(file.FileName))
            {

                string parentPath = HttpContext.Current.Server.MapPath("~/js/main/shpJS/");
                if (!Directory.Exists(parentPath))
                {
                    Directory.CreateDirectory(parentPath);
                }
                file.SaveAs(System.IO.Path.Combine(parentPath, System.IO.Path.GetFileName(file.FileName)));

                //Stream result = new MemoryStream(Encoding.Default.GetBytes(json.ToString()));
                //context.Response.ContentType = "application/json";
                context.Response.Write("");
                context.Response.Flush();
            }
        }
        catch (Exception e)
        {
        }
        finally
        {
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
