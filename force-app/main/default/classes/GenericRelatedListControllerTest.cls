@IsTest
public class GenericRelatedListControllerTest {
    @IsTest
    private static void weCantGetTheRealtedRecordsOfAndObjectIfDoentHaveRelatedRecords() {
        //Setup(Given)
        Account cuenta = new Account(Name = 'Test');
        insert cuenta;

        GenericRelatedListController.RelatedListRequest request = new GenericRelatedListController.RelatedListRequest();
        request.fields = 'Id, CaseNumber';
        request.relatedFieldApiName = 'AccountId';
        request.recordId = cuenta.id;
        request.numberOfRecords = 3;
        request.sObjectApiName = 'Case';
        request.sortDirection = 'Desc, Asc';
        request.sortBy = 'CreatedDate, CaseNumber';

        //Exercise(When)
        Test.startTest();
        GenericRelatedListController.RelatedListResponse response = GenericRelatedListController.initData(request);
        Test.stopTest();

        //Test(Then)
        System.assertEquals('Case', response.sObjectLabel, 'No es el la etiqueta correcta');
        System.assertEquals('Cases', response.sObjectLabelPlural, 'No es el la etiqueta en plural correcta');
        System.assertEquals('Cases', response.parentRelationshipApiName, 'No es el nombre de relacion padre esperada');
        System.assertEquals(0, response.recordsSize, 'No tiene que tener conteo de registros');
        System.assertEquals(
            true,
            response.records.isEmpty(),
            'Tiene que estar vacia por que no tiene registros asociados'
        );
        System.assertNotEquals('', response.iconName, 'No se encontro un icono.');
    }

    @IsTest
    private static void weCanGetTheRealtedRecordsOfAndObject() {
        //Setup(Given)
        Account cuenta = new Account(Name = 'Test');
        insert cuenta;

        Case casoSinRelacion = new Case();
        // Build.anCaseReclamo()
        //     .withType('Alta - Validacion identidad')
        //     .withMotivo('Estado denegado')
        //     .withEtiquetaProveedor('TECO')
        //     .build();

        Case casoViejo = new Case(AccountId = cuenta.Id);
        // Build.anCaseReclamo()
        //     .withAccountId(cuenta)
        //     .withType('Alta - Validacion identidad')
        //     .withMotivo('Estado denegado')
        //     .withEtiquetaProveedor('TECO')
        //     .build();

        Case casoNuevo = new Case(AccountId = cuenta.Id);
        // Build.anCaseReclamo()
        //     .withAccountId(cuenta)
        //     .withType('Alta - Validacion identidad')
        //     .withMotivo('Estado denegado')
        //     .withEtiquetaProveedor('TECO')
        //     .build();
        insert new List<Case>{ casoNuevo, casoViejo, casoSinRelacion };

        Test.setCreatedDate(casoViejo.id, DateTime.now().addDays(-5));

        GenericRelatedListController.RelatedListRequest request = new GenericRelatedListController.RelatedListRequest();
        request.fields = 'Id, CaseNumber';
        request.relatedFieldApiName = 'AccountId';
        request.recordId = cuenta.id;
        request.numberOfRecords = 3;
        request.sObjectApiName = 'Case';
        request.sortDirection = 'Desc, Asc';
        request.sortBy = 'CreatedDate, CaseNumber';

        //Exercise(When)
        Test.startTest();
        GenericRelatedListController.RelatedListResponse response = GenericRelatedListController.initData(request);
        Test.stopTest();

        //Test(Then)
        System.assertEquals('Case', response.sObjectLabel, 'No es el la etiqueta correcta');
        System.assertEquals('Cases', response.sObjectLabelPlural, 'No es el la etiqueta en plural correcta');
        System.assertEquals('Cases', response.parentRelationshipApiName, 'No es el nombre de relacion padre esperada');
        System.assertEquals(2, response.recordsSize, 'Solo tiene que haber dos registro');
        System.assertEquals(casoNuevo.id, ((Case) response.records[0]).id, 'No se trajeron en el orden esperado');
        System.assertEquals(
            false,
            response.records.isEmpty(),
            'No tiene que estar vacia la lista por que hay un solo caso.'
        );
        System.assertNotEquals('', response.iconName, 'No se encontro un icono.');
    }

    @IsTest
    private static void weCanDeleteARecord() {
        //Setup(Given)
        Account anAccount = new Account(Name = 'Test');
        insert anAccount;

        //Exercise(When)
        Test.startTest();
        Boolean result = GenericRelatedListController.deleteRecord(anAccount.id);
        Test.stopTest();

        //Test(Then)
        System.assertEquals(true, result, 'No borro el registro');
    }

    @IsTest
    private static void weCanGetTheIconNameOfObjects() {
        //Setup(Given)

        //Exercise(When)
        Test.startTest();
        String iconNameStandard = GenericRelatedListController.getIconName('Case');
        Test.stopTest();

        //Test(Then)
        System.assertNotEquals('', iconNameStandard, 'No es la URL del icono esperado');
    }
}
