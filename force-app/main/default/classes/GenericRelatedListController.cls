public inherited sharing class GenericRelatedListController {

//     private static final string baseQuery = 'SELECT {0} FROM {1} WHERE {2} = ';

//     @AuraEnabled(cacheable=true)
//     public static RelatedListResponse initData(RelatedListRequest request) {
//         Schema.DescribeSObjectResult sobjectDescribe = Schema.getGlobalDescribe().get(request.sobjectApiName).getDescribe();

//         RelatedListResponse response = new RelatedListResponse();

//         response.parentRelationshipApiName = getParentRelationshipName(
//             request.recordId,
//             request.sobjectApiName,
//             request.relatedFieldApiName
//         );
//         response.sObjectLabelPlural = sobjectDescribe.getLabelPlural();
//         response.sObjectLabel = sobjectDescribe.getLabel();
//         response.iconName = getIconName(request.sobjectApiName);
//         response.records = getRecords(request);
//         response.recordsSize = getRecordsSize(request);
//         response.isCreatable = sobjectDescribe.isCreateable();
//         response.isDeletable = sobjectDescribe.isDeletable();
//         response.isUpdatable = sobjectDescribe.isUpdateable();

//         return response;
//     }

//     public static Integer getRecordsSize(RelatedListRequest request) {
//         String condition = getCondition(request);

//         List<String> params = new List<String>{
//             'COUNT(Id) quantity',
//             request.sObjectApiName,
//             request.relatedFieldApiName
//         };

//         List<Object> result =
//             Database.query(
//                 String.escapeSingleQuotes(
//                     String.format(baseQuery, params) + ':condition'
//                 )
//             );

//         return (Integer) ((AggregateResult) result[0]).get('quantity');
//     }

//     private static string getCondition(RelatedListRequest request){
//         Boolean useForeignKey = String.isNotBlank(request.relationForeignkeyField);
//         return useForeignKey ? request.relationForeignkeyField : request.recordId;
//     }

//     /**Retrieve related Records to show in the component */
//     @AuraEnabled
//     public static List<Sobject> getRecords(RelatedListRequest request) {
//         String condition = getCondition(request);
//         String orderLimitString = ' ORDER BY {0} LIMIT {1}';
//         List<String> params = new List<String>{
//             request.fields,
//             request.sObjectApiName,
//             request.relatedFieldApiName
//         };

//         List<String> params2 = new List<String>{
//             getOrderCondition(request.sortingCondition),
//             String.valueOf(request.numberOfRecords)
//         };

//         return Database.query(
//                 String.escapeSingleQuotes(
//                     String.format(baseQuery, params) + ':condition' + String.format(orderLimitString, params2)
//                 )
//             );
//     }

//     private static String getParentRelationshipName(Id recordId, String childSobjectApiName, String relatedFieldApiName) {
//         Schema.DescribeSObjectResult descrRes = recordId.getSObjectType().getDescribe();
//         String name;
//         for (Schema.ChildRelationship cr : descrRes.getChildRelationships()) {
//             if (
//                 cr.getChildSObject().getDescribe().getName() == childSobjectApiName &&
//                 cr.getField().getDescribe().getName() == relatedFieldApiName
//             ) {
//                 name = cr.getRelationshipName();
//                 break;
//             }
//         }
//         return name;
//     }

//     private static String getOrderCondition(List<OrderCondition> sortingConditions){
//         List<String> orderConditions = new List<String>();

//         for (OrderCondition sortingCondition : sortingConditions ) {
//             orderConditions.add(sortingCondition.toString());
//         }

//         return String.join(orderConditions, ', ');
//     }

//     @AuraEnabled
//     public static Boolean deleteRecord(Id recordId) {
//         Sobject sobj = recordId.getSObjectType().newSObject(recordId);
//         Database.DeleteResult result = Database.delete(sobj, true);
//         return result.isSuccess();
//     }

//     @AuraEnabled
//     public static String getIconName(String sobjectApiName) {
//         String iconName;
//         List<Schema.DescribeTabSetResult> tabSetDesc = Schema.DescribeTabs();
//         List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
//         List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

//         for (Schema.DescribeTabSetResult tsr : tabSetDesc) {
//             tabDesc.addAll(tsr.getTabs());
//         }

//         for (Schema.DescribeTabResult tr : tabDesc) {
//             if (sobjectApiName == tr.getSobjectName()) {
//                 if (tr.isCustom()) {
//                     iconDesc.addAll(tr.getIcons());
//                 } else {
//                     iconName = 'standard:' + sobjectApiName.toLowerCase();
//                 }
//             }
//         }
//         for (Schema.DescribeIconResult ir : iconDesc) {
//             if (ir.getContentType() == 'image/svg+xml') {
//                 iconName = 'custom:' + ir.getUrl().substringBetween('custom/', '.svg').substringBefore('_');
//                 break;
//             }
//         }
//         return iconName;
//     }

//     public class RelatedListRequest {
//         @AuraEnabled
//         public String fields { get; set; }
//         @AuraEnabled
//         public String relatedFieldApiName { get; set; }
//         @AuraEnabled
//         public String recordId { get; set; }
//         @AuraEnabled
//         public Integer numberOfRecords { get; set; }
//         @AuraEnabled
//         public String sObjectApiName { get; set; }
//         @AuraEnabled
//         public String relationForeignkeyField { get; set; }
//         @AuraEnabled
//         public List<OrderCondition> sortingCondition { get; set; }
//     }

//     public class OrderCondition {
//         @AuraEnabled
//         public String field { get; set; }
//         @AuraEnabled
//         public String order { get; set; }

//         public override string toString(){
//             return this.field+' '+this.order;
//         }
//     }

//     public class RelatedListResponse {
//         @AuraEnabled
//         public String sObjectLabel { get; set; }
//         @AuraEnabled
//         public String sObjectLabelPlural { get; set; }
//         @AuraEnabled
//         public String parentRelationshipApiName { get; set; }
//         @AuraEnabled
//         public Integer recordsSize { get; set; }
//         @AuraEnabled
//         public List<Object> records { get; set; }
//         @AuraEnabled
//         public String iconName { get; set; }
//         @AuraEnabled
//         public Boolean isCreatable { get; set; }
//         @AuraEnabled
//         public Boolean isDeletable { get; set; }
//         @AuraEnabled
//         public Boolean isUpdatable { get; set; }

//         public RelatedListResponse() {
//             this.records = new List<Object>();
//             this.iconName = '';
//             this.isCreatable = false;
//             this.isDeletable = false;
//             this.isUpdatable = false;
//             this.recordsSize = 0;
//             this.sObjectLabel = '';
//             this.sObjectLabelPlural = '';
//             this.parentRelationshipApiName = '';
//         }
//     }
// }


// public with sharing class RelatedListGenericaController {

    private static final string baseQuery = 'SELECT {0} FROM {1} WHERE {2} = ';

    @AuraEnabled
    public static RelatedListResponse initData(RelatedListRequest request) {
        Schema.DescribeSObjectResult sobjectDescribe = Schema.getGlobalDescribe().get(request.sobjectApiName).getDescribe();
        RelatedListResponse response = new RelatedListResponse();
        response.parentRelationshipApiName = getParentRelationshipName(
            request.recordId,
            request.sobjectApiName,
            request.relatedFieldApiName
        );
        response.sObjectLabelPlural = sobjectDescribe.getLabelPlural();
        response.sObjectLabel = sobjectDescribe.getLabel();
        response.iconName = getIconName(request.sobjectApiName);
        response.records = getRecords(request);
        response.recordsSize = getRecordsSize(request);
        response.isCreatable = sobjectDescribe.isCreateable();
        response.isDeletable = sobjectDescribe.isDeletable();
        response.isUpdatable = sobjectDescribe.isUpdateable();

        return response;
    }

    public static Integer getRecordsSize(RelatedListRequest request) {
        Boolean useForeignKey = String.isNotBlank(request.relationForeignkeyField);
        String condition = useForeignKey ? request.relationForeignkeyField : request.recordId;

        List<String> params = new List<String>{
            'COUNT(Id) quantity',
            request.sObjectApiName,
            request.relatedFieldApiName
        };
        String query = String.escapeSingleQuotes(String.format(baseQuery, params) + ':condition');
        System.debug(query);
        List<Object> result = Database.query(query);

        return (Integer) ((AggregateResult) result[0]).get('quantity');
    }

    /**Retrieve related Records to show in the component */
    @AuraEnabled
    public static List<Sobject> getRecords(RelatedListRequest request) {
        Boolean useForeignKey = String.isNotBlank(request.relationForeignkeyField);
        String condition = useForeignKey ? request.relationForeignkeyField : request.recordId;
        String orderLimitString = ' ORDER BY ';
        List<String> params = new List<String>{
            request.fields,
            request.sObjectApiName,
            request.relatedFieldApiName
        };

        orderLimitString += getOrderCondition(request.sortBy, request.sortDirection);

        if( request.numberOfRecords != null && request.numberOfRecords > 0){
            orderLimitString += ' LIMIT ' + String.valueOf(request.numberOfRecords);
        }

        String query = String.format(baseQuery, params) + ':condition' + orderLimitString;
        query = String.escapeSingleQuotes(query);
        System.debug(query);
        return Database.query(query);
    }

    private static String getParentRelationshipName(Id recordId, String childSobjectApiName, String relatedFieldApiName) {
        Schema.DescribeSObjectResult descrRes = recordId.getSObjectType().getDescribe();
        String name;
        for (Schema.ChildRelationship cr : descrRes.getChildRelationships()) {
            if (
                cr.getChildSObject().getDescribe().getName() == childSobjectApiName &&
                cr.getField().getDescribe().getName() == relatedFieldApiName
            ) {
                name = cr.getRelationshipName();
                break;
            }
        }
        return name;
    }

    private static String getOrderCondition(String sortBy, String sortDirection){
        List<String> sortFields = sortBy.deleteWhitespace().split(',');
        List<String> sortiDirections = sortDirection.deleteWhitespace().split(',');

        List<String> orderConditions = new List<String>();
        for (Integer i = 0; i < Math.min(sortFields.size(), sortiDirections.size()); i++) {
            orderConditions.add(sortFields[i] + ' ' + sortiDirections[i]);
        }

        return String.join(orderConditions, ', ');
    }

    @AuraEnabled
    public static Boolean deleteRecord(Id recordId) {
        Sobject sobj = recordId.getSObjectType().newSObject(recordId);
        Database.DeleteResult result = Database.delete(sobj, true);
        return result.isSuccess();
    }

    @AuraEnabled
    public static String getIconName(String sobjectApiName) {
        String iconName;
        List<Schema.DescribeTabSetResult> tabSetDesc = Schema.DescribeTabs();
        List<Schema.DescribeTabResult> tabDesc = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> iconDesc = new List<Schema.DescribeIconResult>();

        for (Schema.DescribeTabSetResult tsr : tabSetDesc) {
            tabDesc.addAll(tsr.getTabs());
        }

        for (Schema.DescribeTabResult tr : tabDesc) {
            if (sobjectApiName == tr.getSobjectName()) {
                if (tr.isCustom()) {
                    iconDesc.addAll(tr.getIcons());
                } else {
                    iconName = 'standard:' + sobjectApiName.toLowerCase();
                }
            }
        }
        for (Schema.DescribeIconResult ir : iconDesc) {
            if (ir.getContentType() == 'image/svg+xml') {
                iconName = 'custom:' + ir.getUrl().substringBetween('custom/', '.svg').substringBefore('_');
                break;
            }
        }
        return iconName;
    }

    public class RelatedListRequest {
        @AuraEnabled
        public String fields { get; set; }
        @AuraEnabled
        public String relatedFieldApiName { get; set; }
        @AuraEnabled
        public String recordId { get; set; }
        @AuraEnabled
        public Integer numberOfRecords { get; set; }
        @AuraEnabled
        public String sObjectApiName { get; set; }
        @AuraEnabled
        public String sortDirection { get; set; }
        @AuraEnabled
        public String sortBy { get; set; }
        @AuraEnabled
        public String relationForeignkeyField { get; set; }
    }

    public class RelatedListResponse {
        @AuraEnabled
        public String sObjectLabel { get; set; }
        @AuraEnabled
        public String sObjectLabelPlural { get; set; }
        @AuraEnabled
        public String parentRelationshipApiName { get; set; }
        @AuraEnabled
        public Integer recordsSize { get; set; }
        @AuraEnabled
        public List<Object> records { get; set; }
        @AuraEnabled
        public String iconName { get; set; }
        @AuraEnabled
        public Boolean isCreatable { get; set; }
        @AuraEnabled
        public Boolean isDeletable { get; set; }
        @AuraEnabled
        public Boolean isUpdatable { get; set; }

        public RelatedListResponse() {
            this.isCreatable = false;
            this.isDeletable = false;
            this.isUpdatable = false;
            this.sObjectLabel = '';
            this.sObjectLabelPlural = '';
            this.parentRelationshipApiName = '';
            this.recordsSize = 0;
            this.records = new List<Object>();
            this.iconName = '';
        }
    }
}
