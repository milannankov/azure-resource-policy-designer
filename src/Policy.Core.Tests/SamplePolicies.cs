using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Policy.Core.Tests
{
    public static class SamplePolicies
    {
        public static string SimplePolicy { get; private set; }

        public static string MinimalPolicy { get; private set; }

        public static void LoadPolicies()
        {
            SimplePolicy = File.ReadAllText("./samples/small.json");
            MinimalPolicy = File.ReadAllText("./samples/minimal.json");
        }
    }
}
