using System;
using System.IO;
using Policy.Core;
using Policy.Core.Serialization;
using Policy.Web.Model;

namespace Policy.Web.Controllers
{
    public class PolicyApplicationService
    {
        private string webRoot;

        public PolicyApplicationService(string webRoot)
        {
            if (string.IsNullOrEmpty(webRoot))
            {
                throw new ArgumentNullException("webRoot");
            }

            this.webRoot = webRoot;
        }

        public PolicyRuleProject CreateFromExisting(ParseExistingViewModel model)
        {
            var jsonToParse = this.GetStringToParse(model);
            var rule = this.Parse(jsonToParse);
            var ruleProject = new PolicyRuleProject(Guid.NewGuid().ToString(), rule);
            this.StorePolicy(ruleProject);

            return ruleProject;
        }

        public PolicyRuleProject CreateBlank()
        {
            var rule = this.Parse("{\"then\": {\"effect\": \"deny\"},\"if\": { \"anyof\": []}}");
            var ruleProject = new PolicyRuleProject(Guid.NewGuid().ToString(), rule);
            this.StorePolicy(ruleProject);

            return ruleProject;
        }

        public void Update(string id, string text)
        {
            var repository = new LocalPolicyRuleProjectRepository(this.GetPoliciesStorePath());
            var project = repository.Get(id);

            if(project == null) {
                throw new InvalidOperationException("Rule not found");
            }

            var rule = this.Parse(text);
            var ruleProject = new PolicyRuleProject(project.Id, rule);
            this.StorePolicy(ruleProject);
        }

        public string GetPolicyViewModel(string id) {
            if(string.IsNullOrEmpty(id)) {
                throw new ArgumentNullException("id");
            }

            this.EnsurePoliciesFolder();
            var repository = new LocalPolicyRuleProjectRepository(this.GetPoliciesStorePath());
            var project = repository.Get(id);

            if(project == null) {
                throw new InvalidOperationException("Rule not found");
            }

            return project.RuleJson;
        }

        private void StorePolicy(PolicyRuleProject rule)
        {
            this.EnsurePoliciesFolder();
            var repository = new LocalPolicyRuleProjectRepository(this.GetPoliciesStorePath());

            repository.Save(rule);
        }

        private string GetPoliciesStorePath() {
            return this.webRoot + $@"\data\policies\";
        }

        private void EnsurePoliciesFolder()
        {
            var path = this.GetPoliciesStorePath();

            if (Directory.Exists(path))
            {
                return;
            }

            Directory.CreateDirectory(path);
        }

        private string Parse(string jsonToParse)
        {
            if (string.IsNullOrEmpty(jsonToParse))
            {
                throw new InvalidOperationException("No input provided");
            }


            var reader = new PolicyRuleReader(jsonToParse);
            var rule = reader.AsExtended();

            return rule.ToString();
        }

        private string GetStringToParse(ParseExistingViewModel model)
        {
            var jsonToParse = string.Empty;

            if (model.JsonFile != null)
            {
                var fileStream = model.JsonFile.OpenReadStream();
                var reader = new StreamReader(fileStream);
                jsonToParse = reader.ReadToEnd();
            }
            else
            {
                jsonToParse = model.JsonText;
            }

            return jsonToParse;
        }
    }
}