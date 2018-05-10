using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Policy.Web.Model;

namespace Policy.Web.Controllers
{
    [Route("[controller]")]
    public class PolicyController : Controller
    {
        private IHostingEnvironment hostingEnvironment;

        public PolicyController(IHostingEnvironment hostingEnvironment)
        {
            this.hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("new")]
        public IActionResult NewPolicy()
        {
            var service = new PolicyApplicationService(this.hostingEnvironment.WebRootPath);
            var policy = service.CreateBlank();

            return this.RedirectToRoute("editPolicy", new { id = policy.Id });
        }

        [HttpPost("existing")]
        public IActionResult ExistingPost(ParseExistingViewModel model)
        {
            var service = new PolicyApplicationService(this.hostingEnvironment.WebRootPath);
            var policy = service.CreateFromExisting(model);

            return this.RedirectToRoute("editPolicy", new { id = policy.Id });
        }
        
        [Route("/policy/{id}", Name = "editPolicy")]
        [HttpGet]
        public IActionResult Edit(string id)
        {
            var model = new EditPolicyViewModel() {
                PolicyId = id,  
                GetPolicyEndpoint = this.Url.RouteUrl("GetPolicy", new { id = id}),
                SavePolicyEndpoint = this.Url.RouteUrl("SavePolicy", new { id = id}),
                GetSuggestedValuesEndpoint = "/data/suggested/fields/",
                ChangeEffectEndpoint = this.Url.RouteUrl("ChangePolicyEffect", new { id = id})
            };

            return this.View(model);
        }
    }
}
