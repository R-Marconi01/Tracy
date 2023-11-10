import Server "./lib";
import Blob "mo:base/Blob";
import CertifiedCache "mo:certified-cache";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import HM "mo:base/HashMap";
import HashMap "mo:StableHashMap/FunctionalStableHashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import serdeJson "mo:serde/JSON";
import Option "mo:base-0.7.3/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import Nat "mo:base/Nat";
import Buffer "mo:base/Buffer";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Result "mo:base/Result";
import AssocList "mo:base/AssocList";
import Error "mo:base/Error";
import Nat32 "mo:base/Nat32";
import Types "types";

shared ({ caller = initializer }) actor class () {
  type Response = Server.Response;
  type HttpRequest = Server.HttpRequest;
  type HttpResponse = Server.HttpResponse;
  type DocumentInfo = Types.DocumentInfo;
  type Row = Types.Row;
  type infoRow = Types.infoRow;
  type docId = Text;
  type RowId = Text;
  type User = Types.User;
  type Role = Types.Role;
  type Permission = Types.Permission;

  type FileObject = {
    filename : Text;
  };

  // Access Control
  private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
  private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

  // Canister State
  stable var files = Trie.empty<Text, Blob>();
  private stable var documentsState : [(Text, DocumentInfo)] = [];
  private stable var suppliersDocsState : [(Principal, List.List<docId>)] = [];
  private stable var dbRowsState : [(Text, infoRow)] = [];
  private stable var supplierDBRowsState : [(Principal, List.List<Text>)] = [];
  private stable var usersState : [(Principal, User)] = [];
  private stable var fashionHouseSuppliers : [(Principal, List.List<Principal>)] = [];

  var documents : TrieMap.TrieMap<Text, DocumentInfo> = TrieMap.fromEntries(documentsState.vals(), Text.equal, Text.hash);
  var supplierDocs : TrieMap.TrieMap<Principal, List.List<docId>> = TrieMap.fromEntries(suppliersDocsState.vals(), Principal.equal, Principal.hash);
  var dbRows : TrieMap.TrieMap<Text, infoRow> = TrieMap.fromEntries(dbRowsState.vals(), Text.equal, Text.hash);
  var supplierDBRows : TrieMap.TrieMap<Principal, List.List<Text>> = TrieMap.fromEntries(supplierDBRowsState.vals(), Principal.equal, Principal.hash);
  var users : TrieMap.TrieMap<Principal, User> = TrieMap.fromEntries(usersState.vals(), Principal.equal, Principal.hash);
  var fashionHouseSuppliersMap : TrieMap.TrieMap<Principal, List.List<Principal>> = TrieMap.fromEntries(fashionHouseSuppliers.vals(), Principal.equal, Principal.hash);

  system func preupgrade() {
    cacheStorage := server.entries();
    documentsState := Iter.toArray(documents.entries());
    suppliersDocsState := Iter.toArray(supplierDocs.entries());
    dbRowsState := Iter.toArray(dbRows.entries());
    supplierDBRowsState := Iter.toArray(supplierDBRows.entries());
    usersState := Iter.toArray(users.entries());
    fashionHouseSuppliers := Iter.toArray(fashionHouseSuppliersMap.entries());
  };

  system func postupgrade() {
    ignore server.cache.pruneAll();
    documentsState := [];
    suppliersDocsState := [];
    dbRowsState := [];
    supplierDBRowsState := [];
    usersState := [];
    fashionHouseSuppliers := [];
  };

  func key(x : Text) : Trie.Key<Text> { { key = x; hash = Text.hash(x) } };

  stable var cacheStorage : Server.SerializedEntries = ([], [], [initializer]);

  var server = Server.Server({
    serializedEntries = cacheStorage;
  });

  public query func http_request(req : HttpRequest) : async HttpResponse {
    server.http_request(req);
  };

  public func http_request_update(req : HttpRequest) : async HttpResponse {
    server.http_request_update(req);
  };

  public func invalidate_cache() : async () {
    server.empty_cache();
  };

  func processFileObject(data : Text) : ?FileObject {
    let blob = serdeJson.fromText(data);
    from_candid (blob);
  };

  public shared ({ caller }) func addDocument(document : DocumentInfo) : async () {
    // let (newFiles, existing) = Trie.put(
    //   files, // Target trie
    //   key(path), // Key
    //   Text.equal, // Equality checker
    //   content,
    // );

    // files := newFiles;

    let docsIdList : List.List<docId> = switch (supplierDocs.get(caller)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };

    let newDocs = List.push(document.id, docsIdList);
    supplierDocs.put(caller, newDocs);
    documents.put(document.id, document);
  };

  public shared ({caller}) func updateDocument(document : DocumentInfo) : async () {
    assert(isAdmin(caller));
    documents.put(document.id, document);
  };

  public shared ({ caller }) func addUser(user : User) : async () {
    users.put(caller, user);
  };

  public shared query ({ caller }) func getUser() : async Result.Result<User, Text> {
    switch (users.get(caller)) {
      case (null) {
        return #err("User not found");
      };
      case (?result) { #ok(result) };
    };
  };

  public shared query func getAllUsers() : async [User] {
    Iter.toArray(users.vals());
  };

  public shared ({caller}) func updateUser(user : User) : async () {
    assert(isAdmin(caller) or caller == Principal.fromText(user.principalId));
    users.put(Principal.fromText(user.principalId), user);
  };

  public shared query func getFile(path : Text) : async ?Blob {
    Trie.get(files, key(path), Text.equal);
  };

  public shared query func getAllDocuments() : async [DocumentInfo] {
    Iter.toArray(documents.vals());
  };

  public shared query ({ caller }) func getSupplierDocs() : async [DocumentInfo] {
    let docsIds : List.List<docId> = switch (supplierDocs.get(caller)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };

    let docs = Buffer.Buffer<DocumentInfo>(0);

    let items = List.toArray(docsIds);

    for (doc in items.vals()) {
      switch (documents.get(doc)) {
        case (null) {};
        case (?result) { docs.add(result) };
      };
    };
    return Buffer.toArray(docs);
  };

  public shared ({ caller }) func addSupplierInfo(info : infoRow) : async () {
    let dbRowsList : List.List<Text> = switch (supplierDBRows.get(caller)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };
    let newRows = List.push(info.id, dbRowsList);
    supplierDBRows.put(caller, newRows);
    dbRows.put(info.id, info);
  };

  public shared query func getSupplierInfo(id : Principal) : async [infoRow] {
    let dbRowsList : List.List<Text> = switch (supplierDBRows.get(id)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };

    let rows = Buffer.Buffer<infoRow>(0);
    let items = List.toArray(dbRowsList);

    for (row in items.vals()) {
      switch (dbRows.get(row)) {
        case (null) {};
        case (?result) { rows.add(result) };
      };
    };
    return Buffer.toArray(rows);
  };

  public shared query func getAllDBRows() : async [infoRow] {
    Iter.toArray(dbRows.vals());
  };

  public shared query ({ caller }) func getAllSuppliers() : async [User] {
    let suppliers = TrieMap.mapFilter<Principal, User, User>(
      users,
      Principal.equal,
      Principal.hash,
      func(key, user) = if (user.isSupplier) {
        ?user;
      } else {
        null;
      },
    );
    Iter.toArray(suppliers.vals());
  };

  public shared query func getSupplierByName(name : Text) : async [User] {
    let suppliers = TrieMap.mapFilter<Principal, User, User>(
      users,
      Principal.equal,
      Principal.hash,
      func(key, user) = if (user.isSupplier and user.companyName == name) {
        ?user;
      } else {
        null;
      },
    );
    Iter.toArray(suppliers.vals());
  };

  public shared query func getSuppliersDocuments(id : Principal) : async [DocumentInfo] {
    let docsIds : List.List<docId> = switch (supplierDocs.get(id)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };

    let docs = Buffer.Buffer<DocumentInfo>(0);

    let items = List.toArray(docsIds);

    for (doc in items.vals()) {
      switch (documents.get(doc)) {
        case (null) {};
        case (?result) { docs.add(result) };
      };
    };
    return Buffer.toArray(docs);
  };

  // Fashion House

  public shared ({ caller }) func addToFashionHouseSuppliers(supplierId : Principal) : async () {
    let rowsList : List.List<Principal> = switch (fashionHouseSuppliersMap.get(caller)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };
    let newRows = List.push(supplierId, rowsList);
    fashionHouseSuppliersMap.put(caller, newRows);
  };

  public shared ({ caller }) func removeFromFashionHouseSuppliers(supplierId : Principal) : async () {
    var suppliersList : List.List<Principal> = switch (fashionHouseSuppliersMap.get(caller)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };
    suppliersList := List.filter(
      suppliersList,
      func(item : Principal) : Bool {
        item != supplierId;
      },
    );
    fashionHouseSuppliersMap.put(caller, suppliersList);
  };

  public shared query func getFashionHouseSuppliers(id : Principal) : async [User] {
    let suppliersList : List.List<Principal> = switch (fashionHouseSuppliersMap.get(id)) {
      case (null) {
        List.nil();
      };
      case (?result) { result };
    };
    let suppliers = Buffer.Buffer<User>(0);
    let items = List.toArray(suppliersList);

    for (supplierId in items.vals()) {
      switch (users.get(supplierId)) {
        case (null) {};
        case (?result) { suppliers.add(result) };
      };
    };
    return Buffer.toArray(suppliers);
  };

  public shared query func getAllFashionHouses() : async [User] {
    let fashionHouses = TrieMap.mapFilter<Principal, User, User>(
      users,
      Principal.equal,
      Principal.hash,
      func(key, user) = if (user.isFashion) {
        ?user;
      } else {
        null;
      },
    );
    Iter.toArray(fashionHouses.vals());
  };

  server.post(
    "/file",
    func(req, res) : Response {
      let body = req.body;
      switch body {
        case null {
          Debug.print("body not parsed");
          res.send({
            status_code = 400;
            headers = [];
            body = Text.encodeUtf8("Invalid JSON");
            streaming_strategy = null;
            cache_strategy = #noCache;
          });
        };
        case (?body) {
          let bodyText = body.text();
          Debug.print(bodyText);
          let fileObj = processFileObject(bodyText);
          switch fileObj {
            case null {
              res.send({
                status_code = 400;
                headers = [];
                body = Text.encodeUtf8("Error in process json.");
                streaming_strategy = null;
                cache_strategy = #noCache;
              });
            };
            case (?fileObj) {
              let file = Trie.get(files, key(fileObj.filename), Text.equal);
              switch file {
                case null {
                  return res.send({
                    status_code = 404;
                    headers = [];
                    body = Text.encodeUtf8("File not found");
                    streaming_strategy = null;
                    cache_strategy = #noCache;
                  });
                };
                case (?blob) {
                  return res.send({
                    status_code = 200;
                    headers = [("Content-Type", "application/pdf")];
                    body = blob;
                    streaming_strategy = null;
                    cache_strategy = #default;
                  });
                };
              };
            };
          };
        };
      };
    },
  );

  let db = Buffer.Buffer<Row>(3);

  func processRow(data : Text) : ?Row {
    let blob = serdeJson.fromText(data);
    from_candid (blob);
  };

  server.post(
    "/add-row",
    func(req, res) : Response {
      let body = req.body;
      switch body {
        case null {
          Debug.print("body not parsed");
          res.send({
            status_code = 400;
            headers = [];
            body = Text.encodeUtf8("Invalid JSON");
            streaming_strategy = null;
            cache_strategy = #noCache;
          });
        };
        case (?body) {
          let bodyText = body.text();
          Debug.print(bodyText);
          let row = processRow(bodyText);
          switch (row) {
            case null {
              Debug.print("row not parsed");
              res.send({
                status_code = 400;
                headers = [];
                body = Text.encodeUtf8("Invalid JSON");
                streaming_strategy = null;
                cache_strategy = #noCache;
              });
            };
            case (?row) {
              db.add(row);
              res.json({
                status_code = 201;
                body = "{ \"response\": \"ok\" }";
                cache_strategy = #noCache;
              });
            };
          };
        };
      };
    },
  );

  server.get(
    "/get-row-db",
    func(req, res) : Response {
      var counter = 0;

      var rowJson = "{ ";
      for (row in db.vals()) {
        rowJson := rowJson # "\"" # Nat.toText(counter) # "\": { \"id\": \"" # Nat.toText(row.id) # "\", \"companyName\": \"" # row.companyName # "\", \"cityDestination\": \"" # row.cityDestination # "\", \"supplier\": \"" # row.supplier # "\", \"cityOrigin\": \"" # row.cityOrigin # "\", \"productType\": \"" # row.productType # "\", \"quantity\": " # Nat.toText(row.quantity) # " }, ";
        counter += 1;
      };
      rowJson := Text.trimEnd(rowJson, #text ", ");
      rowJson := rowJson # " }";

      res.json({
        status_code = 200;
        body = rowJson;
        cache_strategy = #noCache;
      });
    },
  );

  public func getDB() : async [Row] {
    Buffer.toArray(db);
  };

  // Access Control
  func principal_eq(a : Principal, b : Principal) : Bool {
    return a == b;
  };

  func get_role(pal : Principal) : ?Role {
    if (pal == initializer) {
      ? #owner;
    } else {
      AssocList.find<Principal, Role>(roles, pal, principal_eq);
    };
  };

  // Determine if a principal has a role with permissions
  func has_permission(pal : Principal, perm : Permission) : Bool {
    let role = get_role(pal);
    switch (role, perm) {
      case (? #owner or ? #admin, _) true;
      case (? #authorized, #lowest) true;
      case (_, _) false;
    };
  };

  func isAdmin(pal : Principal) : Bool {
    let role = get_role(pal);
    switch (role) {
      case (? #owner or ? #admin) true;
      case (_) false;
    };
  };

  // Reject unauthorized user identities
  func require_permission(pal : Principal, perm : Permission) : async () {
    if (has_permission(pal, perm) == false) {
      throw Error.reject("unauthorized");
    };
  };

  // Assign a new role to a principal
  public shared ({ caller }) func assign_role(assignee : Principal, new_role : ?Role) : async () {
    await require_permission(caller, #assign_role);

    switch new_role {
      case (? #owner) {
        throw Error.reject("Cannot assign anyone to be the owner");
      };
      case (_) {};
    };
    if (assignee == initializer) {
      throw Error.reject("Cannot assign a role to the canister owner");
    };
    roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, new_role).0;
    role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
  };

  // Return the principal of the message caller/user identity
  public shared ({ caller }) func callerPrincipal() : async Principal {
    return caller;
  };

  // Return the role of the message caller/user identity
  public shared ({ caller }) func my_role() : async Text {
    let role = get_role(caller);
    switch (role) {
      case (null) {
        return "unauthorized";
      };
      case (? #owner) {
        return "owner";
      };
      case (? #admin) {
        return "admin";
      };
      case (? #authorized) {
        return "authorized";
      };
    };
  };

};
