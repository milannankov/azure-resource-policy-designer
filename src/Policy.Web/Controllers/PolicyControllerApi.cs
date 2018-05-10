using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Policy.Web.Model;

namespace Policy.Web.Controllers
{
    [Route("api/policy")]
    public class PolicyControllerApi : Controller
    {
        private IHostingEnvironment hostingEnvironment;

        public PolicyControllerApi(IHostingEnvironment hostingEnvironment)
        {
            this.hostingEnvironment = hostingEnvironment;
        }

        [Route("{id}", Name = "GetPolicy")]
        [HttpGet]
        public JsonResult Get(string id)
        {
            var service = new PolicyApplicationService(this.hostingEnvironment.WebRootPath);
            var json = service.GetPolicyViewModel(id);

            var parsed = JObject.Parse(json);
            return this.Json(parsed);
        }

        [Route("{id}/Save", Name = "SavePolicy")]
        [HttpPost]
        public ActionResult Save([FromBody] SavePolicyVersionModel model)
        {
            var service = new PolicyApplicationService(this.hostingEnvironment.WebRootPath);
            service.Update(model.PolicyId, model.PolicyText);

            return this.Ok();
        }
    }
}
