using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Policy.Core.Extensions;
using Newtonsoft.Json.Linq;

namespace Policy.Core.Tests.Extensions
{
    [TestClass]
    public class JsonPolicyExtensionsTests
    {
        private readonly List<JObject> AllLogicalTypes = new List<JObject> {
            JObject.FromObject(new { not = "some value" }),
            JObject.FromObject(new { allOf = "some value" }),
            JObject.FromObject(new { anyOf = "some value" }),
            JObject.FromObject(new { @if = "some value" })
        };

        private readonly List<JObject> AllConditionTypes = new List<JObject> {
            JObject.FromObject(new { equals = new { field = "someField" } }),
            JObject.FromObject(new { like = "some value" }),
            JObject.FromObject(new { match = "some value" }),
            JObject.FromObject(new { contains = "some value" }),
            JObject.FromObject(new { @in = "some value" }),
            JObject.FromObject(new { containskey = "some value" }),
            JObject.FromObject(new { exists = "some value" })
        };

        [TestMethod]
        public void IsLogical_WhenLogicalPropertyExists_ReturnsTrue()
        {
            AllLogicalTypes.ForEach((o) => {
                Assert.IsTrue(JsonPolicyExtensions.IsLogical(o), $"IsLogical false for: {o.ToString()}");
            });
        }

        [TestMethod]
        public void IsLogical_WhenNoLogicalPropertyExists_ResturnsFalse()
        {
            var nonLogical = JObject.FromObject(new { nonLogicalProp = "some value" });

            Assert.IsFalse(JsonPolicyExtensions.IsLogical(nonLogical));
        }

        [TestMethod]
        public void GetLogicalOperatorType_WhenObjectHasLogicalProperty_ReturnsTheLogicalOperator()
        {
            var logicalNot = AllLogicalTypes.First();

            Assert.AreEqual(
                "not", 
                JsonPolicyExtensions.GetLogicalOperatorType(logicalNot));
        }

        [TestMethod]
        public void IsCondition_WhenConditionPropertyExists_ReturnTrue()
        {
            AllConditionTypes.ForEach((o) => {
                Assert.IsTrue(JsonPolicyExtensions.IsCondition(o), $"IsCondition false for: {o.ToString()}");
            });
        }

        [TestMethod]
        public void GetConditionType_WhenObjectIsCondition_ReturnsTheLogicalType()
        {
            var equalsCondition = AllConditionTypes.First();

            Assert.AreEqual(
                "equals",
                JsonPolicyExtensions.GetConditionType(equalsCondition));
        }

        [TestMethod]
        public void GetConditionField_WhenConditionBodyIsPassed_WhenFieldPropertyExists_ReturnsTheFieldValue()
        {
            var equalsConditionBody = AllConditionTypes.First()["equals"] as JObject;

            Assert.AreEqual(
                "someField",
                JsonPolicyExtensions.GetConditionField(equalsConditionBody));
        }

        [TestMethod]
        public void GetConditionValue_WhenConditionObjectPassed_ReturnsTheBodyOfTheCondition()
        {
            var equalsCondition = AllConditionTypes.First();
            var equalsConditionBody = equalsCondition["equals"] as JObject;

            Assert.AreSame(
                equalsConditionBody,
                JsonPolicyExtensions.GetConditionValue(equalsCondition)
            );
        }
    }
}
