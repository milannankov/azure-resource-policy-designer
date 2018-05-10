using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json.Linq;
using Policy.Core.Serialization;
using System.Linq;

namespace Policy.Core.Tests.Serialization
{
    [TestClass]
    public class PolicyRuleReaderTests
    {
        [TestMethod]
        public void AsExtended_WhenJsonIsValid_BuildsExtendedVersionOfRule()
        {
            var reader = new PolicyRuleReader(SamplePolicies.MinimalPolicy);
            var extended = reader.AsExtended();
            var expectedThen = JObject.FromObject(new { effect = "deny" });
            
            Assert.IsTrue(extended.Properties().Any(p => p.Name == "id"), "Id property not found");
            Assert.IsTrue(extended.Properties().Any(p => p.Name == "if"), "If property not found");
            Assert.IsTrue(JObject.DeepEquals(expectedThen, extended["then"]));
        }

        [TestMethod]
        public void AsExtended_WhenJsonIsValid_BuildExtendedVersionOfLogicalNodes()
        {
            var reader = new PolicyRuleReader(SamplePolicies.MinimalPolicy);
            var extended = reader.AsExtended();
            var logicalNode = extended["if"] as JObject;

            Assert.IsTrue(logicalNode.Properties().Any(p => p.Name == "id"), "Id property not found");
            Assert.IsTrue(logicalNode.Properties().Any(p => p.Name == "children"), "children property not found");
            Assert.AreEqual("logical", logicalNode["nodeType"]);
            Assert.AreEqual("allof", logicalNode["logicalType"]);
        }

        [TestMethod]
        public void AsExtended_WhenJsonIsValid_BuildExtendedVersionOfConditionNodes()
        {
            var reader = new PolicyRuleReader(SamplePolicies.MinimalPolicy);
            var extended = reader.AsExtended();
            var conditionNode = extended["if"]["children"].First() as JObject;

            Assert.IsTrue(conditionNode.Properties().Any(p => p.Name == "id"), "Id property not found");
            Assert.AreEqual("condition", conditionNode["nodeType"]);
            Assert.AreEqual("equals", conditionNode["conditionType"]);
            Assert.AreEqual("type", conditionNode["conditionField"]);
            Assert.AreEqual("Microsoft.Storage/storageAccounts", conditionNode["conditionValue"]);
        }
    }
}
