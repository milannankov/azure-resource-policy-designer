using System;

namespace Policy.Core
{
    public class PolicyRuleProject 
    {
        public string Id 
        {
            get;
        }

        public string RuleJson 
        {
            get;
        }

        public PolicyRuleProject(string id, string ruleJson) 
        {
            this.Id = id;
            this.RuleJson = ruleJson;
        }
    }
}