using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Policy.Web.Model
{
    public class ParseExistingViewModel {
        public string JsonText {
            get;
            set;
        }

        public IFormFile JsonFile {
            get;
            set;
        }
    }
}