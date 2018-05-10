using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Policy.Web.Model
{
    public class EditPolicyViewModel {
        public string PolicyId { get; set; }

        public string GetPolicyEndpoint { get; set; }

        public string SavePolicyEndpoint { get; set; }

        public string GetSuggestedValuesEndpoint {get; set; }
        
        public string ChangeEffectEndpoint {get; set;}
    }
}