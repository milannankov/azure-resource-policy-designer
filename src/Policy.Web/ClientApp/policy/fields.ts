export interface IKnownPolicyField {
    value: string;
    group: string;
    description: string;
}

const FieldExpressionRegExp = new RegExp("^\\[(json|if|and|or|not|concat|parameters|variables|deployment|reference|resourceId|resourceGroup|subscription|list.*|base64|providers|copyIndex|padLeft|replace|toLower|toUpper|startsWith|endsWith|length|split|skip|take|contains|intersection|union|first|last|indexOf|lastIndexOf|add|sub|mul|div|mod|min|max|range|string|int|float|bool|trim|uri|uniqueString|substring|base64ToString|base64ToJson|uriComponentToString|uriComponent|dataUriToString|dataUri|array|createArray|coalesce|empty|less|lessOrEquals|greater|greaterOrEquals|equals)\\(.*\\).*\\]$");

export class FieldValue {

    public readonly isExpression : boolean = false;

    constructor(public readonly value: string = "") {
        this.isExpression = FieldExpressionRegExp.test(value);
    }

    public static empty() {
        return new FieldValue("");
    }
}

class KnownPolicyField implements IKnownPolicyField {
    constructor(public readonly value: string, public readonly group: string, public readonly description: string = "") {

        if (!value) {
            throw Error("value is required for KnownFieldDescriptor");
        }

        if (!group) {
            throw Error("group is required for KnownFieldDescriptor");
        }
    }
}

const MicrosoftCacheRedisFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Cache/Redis/enableNonSslPort", "Microsoft.Cache/Redis", "Set whether the non-ssl Redis server port (6379) is enabled."),
    new KnownPolicyField("Microsoft.Cache/Redis/shardCount", "Microsoft.Cache/Redis", "Set the number of shards to be created on a Premium Cluster Cache."),
    new KnownPolicyField("Microsoft.Cache/Redis/sku.capacity", "Microsoft.Cache/Redis", "Set the size of the Redis cache to deploy."),
    new KnownPolicyField("Microsoft.Cache/Redis/sku.family", "Microsoft.Cache/Redis", "Set the SKU family to use."),
    new KnownPolicyField("Microsoft.Cache/Redis/sku.name", "Microsoft.Cache/Redis", "Set the type of Redis Cache to deploy.")
];

const MicrosoftComputedisksFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Compute/imageOffer", "Microsoft.Compute/disks", "Set the offer of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imagePublisher", "Microsoft.Compute/disks", "Set the publisher of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageSku", "Microsoft.Compute/disks", "Set the SKU of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageVersion", "Microsoft.Compute/disks", "Set the version of the platform image or marketplace image used to create the virtual machine."),
];

const MicrosoftComputevirtualMachinesFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Compute/imageId", "Microsoft.Compute/virtualMachines", "Set the identifier of the image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageOffer", "Microsoft.Compute/virtualMachines", "Set the offer of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imagePublisher", "Microsoft.Compute/virtualMachines", "Set the publisher of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageSku", "Microsoft.Compute/virtualMachines", "Set the SKU of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageVersion", "Microsoft.Compute/virtualMachines", "Set the version of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/licenseType", "Microsoft.Compute/virtualMachines", "Set that the image or disk is licensed on-premises. This value is only used for images that contain the Windows Server operating system."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/imageOffer", "Microsoft.Compute/virtualMachines", "Set the offer of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/imagePublisher", "Microsoft.Compute/virtualMachines", "Set the publisher of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/imageSku", "Microsoft.Compute/virtualMachines", "Set the SKU of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/imageVersion", "Microsoft.Compute/virtualMachines", "Set the version of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/osDisk.Uri", "Microsoft.Compute/virtualMachines", "Set the vhd URI."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/sku.name", "Microsoft.Compute/virtualMachines", "Set the vhd URI."),
];

const MicrosoftComputevirtualMachinesextensionsFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Compute/virtualMachines/extensions/publisher", "Microsoft.Compute/virtualMachines/extensions", "Set the name of the extension’s publisher."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/extensions/type", "Microsoft.Compute/virtualMachines/extensions", "Set the type of extension."),
    new KnownPolicyField("Microsoft.Compute/virtualMachines/extensions/typeHandlerVersion", "Microsoft.Compute/virtualMachines/extensions", "Set the version of the extension."),
];

const MicrosoftComputevirtualMachineScaleSetsFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Compute/imageId", "Microsoft.Compute/virtualMachineScaleSets", "Set the identifier of the image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageOffer", "Microsoft.Compute/virtualMachineScaleSets", "Set the offer of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imagePublisher", "Microsoft.Compute/virtualMachineScaleSets", "Set the publisher of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageSku", "Microsoft.Compute/virtualMachineScaleSets", "Set the SKU of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/imageVersion", "Microsoft.Compute/virtualMachineScaleSets", "Set the SKU of the platform image or marketplace image used to create the virtual machine."),
    new KnownPolicyField("Microsoft.Compute/licenseType", "Microsoft.Compute/virtualMachineScaleSets", "Set that the image or disk is licensed on-premises. This value is only used for images that contain the Windows Server operating system."),
    new KnownPolicyField("Microsoft.Compute/VirtualMachineScaleSets/computerNamePrefix	", "Microsoft.Compute/virtualMachineScaleSets", "Set the computer name prefix for all the virtual machines in the scale set."),
    new KnownPolicyField("Microsoft.Compute/VirtualMachineScaleSets/osdisk.imageUrl", "Microsoft.Compute/virtualMachineScaleSets", "Set the blob URI for user image."),
    new KnownPolicyField("Microsoft.Compute/VirtualMachineScaleSets/osdisk.vhdContainers", "Microsoft.Compute/virtualMachineScaleSets", "Set the container URLs that are used to store operating system disks for the scale set."),
    new KnownPolicyField("Microsoft.Compute/VirtualMachineScaleSets/sku.name", "Microsoft.Compute/virtualMachineScaleSets", "Set the size of virtual machines in a scale set."),
    new KnownPolicyField("Microsoft.Compute/VirtualMachineScaleSets/sku.tier", "Microsoft.Compute/virtualMachineScaleSets", "Set the tier of virtual machines in a scale set."),
];

const MicrosoftNetworkvirtualNetworkGatewaysFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Network/virtualNetworkGateways/gatewayType", "Microsoft.Network/virtualNetworkGateways", "Set the type of this virtual network gateway."),
    new KnownPolicyField("Microsoft.Network/virtualNetworkGateways/sku.name", "Microsoft.Network/virtualNetworkGateways", "Set the gateway SKU name."),
];

const MicrosoftSqldatabasesFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Sql/servers/databases/edition", "Microsoft.Sql/databases", "Set the edition of the database."),
    new KnownPolicyField("Microsoft.Sql/servers/databases/elasticPoolName", "Microsoft.Sql/databases", "Set the name of the elastic pool the database is in."),
    new KnownPolicyField("Microsoft.Sql/servers/databases/requestedServiceObjectiveId", "Microsoft.Sql/databases", "Set the configured service level objective ID of the database."),
    new KnownPolicyField("Microsoft.Sql/servers/databases/requestedServiceObjectiveName", "Microsoft.Sql/databases", "Set the configured service level objective ID of the database."),
];

const MicrosoftSqlelasticpoolsFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Sql/servers/elasticPools/dtu", "Microsoft.Sql/elasticpools", ""),
    new KnownPolicyField("Microsoft.Sql/servers/elasticPools/edition", "Microsoft.Sql/elasticpools", ""),
];

const MicrosoftStoragestorageAccountsFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("Microsoft.Storage/storageAccounts/accessTier", "Microsoft.Storage/storageAccounts", "	Set the access tier used for billing."),
    new KnownPolicyField("Microsoft.Storage/storageAccounts/accountType", "Microsoft.Storage/storageAccounts", "Set the SKU name."),
    new KnownPolicyField("Microsoft.Storage/storageAccounts/enableBlobEncryption", "Microsoft.Storage/storageAccounts", "Set whether the service encrypts the data as it is stored in the blob storage service."),
    new KnownPolicyField("Microsoft.Storage/storageAccounts/enableFileEncryption", "Microsoft.Storage/storageAccounts", "Set whether the service encrypts the data as it is stored in the file storage service."),
    new KnownPolicyField("Microsoft.Storage/storageAccounts/sku.name", "Microsoft.Storage/storageAccounts", "Set the SKU name."),
    new KnownPolicyField("Microsoft.Storage/storageAccounts/supportsHttpsTrafficOnly", "Microsoft.Storage/storageAccounts", "Set to allow only https traffic to storage service."),
];

const ListOfAliasFields: Array<IKnownPolicyField> = [
    ...MicrosoftCacheRedisFields,
    ...MicrosoftComputedisksFields,
    ...MicrosoftComputevirtualMachinesFields,
    ...MicrosoftComputevirtualMachinesextensionsFields,
    ...MicrosoftComputevirtualMachineScaleSetsFields,
    ...MicrosoftNetworkvirtualNetworkGatewaysFields,
    ...MicrosoftSqldatabasesFields,
    ...MicrosoftSqlelasticpoolsFields,
    ...MicrosoftStoragestorageAccountsFields,
    new KnownPolicyField("Microsoft.CDN/profiles/sku.name", "Microsoft.CDN", "The SKU (tier) or Content Delivery Network"),
    new KnownPolicyField("Microsoft.Network/applicationGateways/sku.name", "Microsoft.Network/applicationGateways", "Set the size of the gateway."),
    new KnownPolicyField("Microsoft.Sql/servers/version", "Microsoft.Sql/servers", "Set the version of the server."),
];

const ListOfGenericFields: Array<IKnownPolicyField> = [
    new KnownPolicyField("name", "Generic", "The name of the resource"),
    new KnownPolicyField("kind", "Generic", "The kind of the resource"),
    new KnownPolicyField("type", "Generic", "The type of the resource"),
    new KnownPolicyField("location", "Generic", "The data center of the resource"),
    new KnownPolicyField("tags", "Generic", "The collection of tags assiged to the resource"),
    new KnownPolicyField("tags.customTag", "Generic", "Custom tag assigned to the resource"),
];

export const KnownFields: ReadonlyArray<IKnownPolicyField> = [
    ...ListOfAliasFields,
    ...ListOfGenericFields
]