using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;

namespace Policy.Core.Tests
{
    [TestClass]
    public class Initialize
    {
        [AssemblyInitialize]
        public static void AssemblyInitialize(TestContext context)
        {
            SamplePolicies.LoadPolicies();
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
        }
    }
}
