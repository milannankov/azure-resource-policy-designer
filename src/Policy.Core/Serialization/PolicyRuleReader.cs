using System;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static Policy.Core.Extensions.JsonPolicyExtensions;

namespace Policy.Core.Serialization
{
    public class PolicyRuleReader
    {
        private JObject rule;

        public PolicyRuleReader(string ruleJson)
        {
            //TODO: validate here
            this.rule = JsonConvert.DeserializeObject(ruleJson) as JObject;
        }

        public JObject AsExtended()
        {
            var result = new JObject
            {
                { "id", Guid.NewGuid().ToString() },
                { "if", this.BuildIf(this.rule["if"] as JObject) },
                { "then", this.BuildThen(this.rule["then"] as JObject) }
            };

            return result;
        }

        private JToken BuildIf(JObject ifBody)
        {
            if (ifBody.IsLogical())
            {
                return this.BuildLogical(ifBody);
            }

            if (ifBody.IsCondition())
            {
                return this.BuildCondition(ifBody);
            }

            throw new InvalidOperationException("Unknown node type");
        }

        private JObject BuildHierarchy(JObject body)
        {
            if (body.IsLogical())
            {
                return this.BuildLogical(body);
            }

            if (body.IsCondition())
            {
                return this.BuildCondition(body);
            }

            throw new InvalidOperationException("Unknown node type");
        }

        private JObject BuildCondition(JObject body)
        {
            var conditionField = body.GetConditionField();
            var conditionType = body.GetConditionType();
            var conditionValue = body.GetConditionValue();

            return JObject.FromObject(new
            {
                id = Guid.NewGuid().ToString(),
                nodeType = "condition",
                conditionField,
                conditionType,
                conditionValue
            });
        }

        private JObject BuildLogical(JObject body)
        {
            var logicalType = body.GetLogicalOperatorType();
            var inner = body.Properties().FirstOrDefault().Value;
            var array = inner as JArray;

            return JObject.FromObject(new
            {
                id = Guid.NewGuid().ToString(),
                nodeType = "logical",
                logicalType,
                children = array == null ?
                    new JArray(this.BuildHierarchy(inner as JObject)) :
                    new JArray(array.ToList().Select(_ => this.BuildHierarchy(_ as JObject)))
            });
        }

        private JToken BuildThen(JObject ruleThen)
        {
            var then = new JObject
        {
            { "effect", ruleThen["effect"].ToString() }
        };

            return then;
        }
    }
}
