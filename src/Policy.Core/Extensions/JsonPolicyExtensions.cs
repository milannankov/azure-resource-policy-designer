using System;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace Policy.Core.Extensions
{
    public static class JsonPolicyExtensions
    {
        private static string[] LogicalPropertyNames = new[] { "not", "allof", "anyof", "if" };
        private static string[] ConditionPropertyNames = new[] { "equals", "like", "match", "contains", "in", "containskey", "exists" };

        public static bool IsLogical(this JObject json)
        {
            return json
                    .Properties()
                    .Select(p => p.Name.ToLower())
                    .Any(p => IsLogicalPropertyName(p));
        }

        private static bool IsLogicalPropertyName(string propertyName)
        {
            propertyName = propertyName.ToLower();

            return LogicalPropertyNames.Contains(propertyName);
        }

        public static string GetLogicalOperatorType(this JObject condition)
        {
            var logicalOpertorType = condition
                .Properties()
                .Where(p => IsLogicalPropertyName(p.Name))
                .FirstOrDefault()?.Name.ToLower();

            return logicalOpertorType;
        }

        public static bool IsCondition(this JObject json)
        {
            return json
                    .Properties()
                    .Select(p => p.Name.ToLower())
                    .Any(p => IsConditionPropertyName(p));
        }

        private static bool IsConditionPropertyName(string propertyName)
        {
            propertyName = propertyName.ToLower();

            return ConditionPropertyNames.Contains(propertyName);
        }

        public static string GetConditionField(this JObject node)
        {
            var field = node
                .Properties().FirstOrDefault(p => p.Name == "field")?.Value.ToString();

            return field;
        }

        public static string GetConditionType(this JObject node)
        {
            var conditionType = node
                    .Properties()
                    .Select(p => p.Name.ToLower())
                    .FirstOrDefault(p => IsConditionPropertyName(p));

            if (string.IsNullOrEmpty(conditionType))
            {
                throw new InvalidOperationException("Unknown condition type.");
            }

            return conditionType;
        }

        public static JToken GetConditionValue(this JObject node)
        {
            var conditionType = node
                    .Properties()
                    .Select(p => p.Name.ToLower())
                    .FirstOrDefault(p => IsConditionPropertyName(p));

            if (string.IsNullOrEmpty(conditionType))
            {
                throw new InvalidOperationException("Unknown condition criteria.");
            }

            return node[conditionType];
        }
    }
}