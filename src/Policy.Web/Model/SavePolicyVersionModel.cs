using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Policy.Web.Model
{
    public class SavePolicyVersionModel {
        public string PolicyId {
            get;
            set;
        }

        public string PolicyText {
            get;
            set;
        }
    }
}