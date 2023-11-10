import Text "mo:base/Text";
module {

    public type Row = {
        id : Nat;
        companyName : Text;
        cityDestination : Text;
        supplier : Text;
        cityOrigin : Text;
        productType : Text;
        quantity : Nat;
    };
    public type infoRow = {
        id : Text;
        companyName : Text;
        cityDestination : Text;
        supplier : Text;
        cityOrigin : Text;
        productType : Text;
        quantity : Nat;
    };

    public type DocumentInfo = {
        id : Text;
        filename : Text;
        file : Text;
        points : Nat32;
        filetype : Text;
        verified : Bool;
    };

    public type User = {
        isSupplier : Bool;
        isFashion : Bool;
        companyName : Text;
        principalId : Text;
        created : Int;
    };
    public type Role = {
        #owner;
        #admin;
        #authorized;
    };

    public type Permission = {
        #assign_role;
        #lowest;
    };
};
