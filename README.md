# Azure Resource Policy Designer
[![Build Status](https://mnankov.visualstudio.com/_apis/public/build/definitions/2ec24b12-fd03-4b5d-811c-5eb5c5ffd09d/8/badge)](https://mnankov.visualstudio.com/_apis/public/build/definitions/2ec24b12-fd03-4b5d-811c-5eb5c5ffd09d/8/badge)  
Azure Resource Policy Designer is a tool for editing resource policies visually.
The tool provides clean design surface and quick navigation. Progress is saved so that editing can resume at any point in time.

You can try the visual policy editor right away at [https://resourcepolicydesigner.azurewebsites.net/](https://resourcepolicydesigner.azurewebsites.net/)

![Screenshot 1](/images/designer2.PNG)

Any feedback is appreciated.
Currently, only policy rules can be parsed and updated.
There is limitted support for Audit and Append effects.

# Deploying to your own environment

Resource policies might reveal some confidential information or might simply want to have more control on where and how information regarding resouce policies is being saved.  
All deployable versions of the app can be found in the [Releases](https://github.com/milannankov/azure-resource-policy-designer/releases) section. 

The only requirement on the hosting environment is to be able to run ASP.NET Core applications.

# License & Contributing to the app

We do accept pull requests, issues, comments, and anything else that might make this project better and feature-rich.
Bear in mind that the app currently makes use of Kendo UI components and a developer license is required for each developer that is working on the project.

The app itself is distributed under the MIT license but it is also subject to the limitations and terms of the Telerik End User License Agreement for Progress Kendo UI.
Please check out the [Telerik End User License Agreement for Progress Kendo UI](https://www.telerik.com/purchase/license-agreement/kendo-ui).

## Our Company

[![New Venture Software](nvs.png "New Venture Software")](https://www.newventuresoftware.com?utm_source=github&utm_medium=azure_policy&utm_campaign=public_projects_and_samples)

Do you need assistance on your project? Drop us a line at [www.newventuresoftware.com/contact](https://www.newventuresoftware.com/contact?utm_source=github&utm_medium=azure_policy&utm_campaign=public_projects_and_samples).  
New Venture Software is an expert software consulting, custom software and user experience development company. Defined by its passion for building software the right way, New Venture Software delivers amazing software experiences through technological innovation, thoughtful user experience design and flawlessly built software solutions.