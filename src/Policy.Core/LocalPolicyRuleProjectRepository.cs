using System;
using System.IO;

namespace Policy.Core
{
    public class LocalPolicyRuleProjectRepository
    {
        private string dataPath = string.Empty;

        public LocalPolicyRuleProjectRepository(string dataPath)
        {
            if(string.IsNullOrEmpty(dataPath)) {
                throw new ArgumentNullException(dataPath);
            }

            this.dataPath = dataPath;
        }

        private string GetPolicyPath(string policyId) {
            var fileName = policyId + ".json";
            var filePath = this.dataPath + $"/{fileName}";

            return filePath;
        }

        public PolicyRuleProject Get(string azurePolicyId)
        {
            var filePath = this.GetPolicyPath(azurePolicyId);
            
            if(!File.Exists(filePath)) {
                throw new InvalidOperationException("Policy does not exist.");
            }

            var json = File.ReadAllText(filePath);
            var project = new PolicyRuleProject(azurePolicyId, json);

            return project;
        }

        public void Save(PolicyRuleProject project)
        {
            if(project == null) {
                throw new ArgumentNullException("project");
            }

            var filePath = this.GetPolicyPath(project.Id);
            File.WriteAllText(filePath, project.RuleJson);
        }
    }
}