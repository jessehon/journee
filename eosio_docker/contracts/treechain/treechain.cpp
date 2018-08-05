#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

// Smart Contract Name: treechain
// Table struct:
//   treestruct: multi index table to store the trees
//     prim_key(uint64): primary key
//     user(account_name/uint64): account name for the user
//     tree(string): the tree message
//     timestamp(uint64): the store the last update block time
// Public method:
//   isnewdna => to check if the given dna has tree in table or not
// Public actions:
//   update => put the tree into the multi-index table and sign by the given account
//   carbon => estimate carbon usage for a particular object

// Replace the contract class name when you start your own project
class treechain : public eosio::contract {
  private:
    bool isnewdna( std::string dna ) {
      treetable treeobj(_self, _self);
      // get object by secordary key
      auto trees = treeobj.get_index<N(getbydna)>();
      auto tree = trees.find(string_to_name(dna.c_str()));

      return tree == trees.end();
    }

    /// @abi table
    struct treestruct {
      uint64_t      prim_key;  // primary key
      account_name  user;      // account name for the user
      std::string   dna;      // the tree message
      std::string   message;      // the tree message
      uint64_t      timestamp; // the store the last update block time

      // primary key
      auto primary_key() const { return prim_key; }
      // secondary key: dna (max length of 12)
      uint64_t get_by_dna() const { return string_to_name(dna.c_str()); }
    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< N(treestruct), treestruct,
      indexed_by< N(getbydna), const_mem_fun<treestruct, uint64_t, &treestruct::get_by_dna> >
      > treetable;

  public:
    using contract::contract;

    // This action inserts into a table information about the lineage
    // of a botanical item.
    // While we are using dna as a demonstration string we will move
    // to hashing dna with a public salt that is per account (such as
    // the account public key). With this process we will not show
    // the actual DNA so an intermediate supplier would not be able
    // to say they processed the tree without actually taking a sample
    // of DNA. Verification of this process would require the actual
    // DNA of the object (tests for this are currently arround $20 but
    // decreasing).

    /// @abi action
    void insert( account_name _user, std::string& _dna, std::string& _message ) {
      // to sign the action with the given account
      require_auth( _user );

      treetable obj(_self, _self); // code, scope

      // insert object
      obj.emplace( _self, [&]( auto& address ) {
        address.prim_key    = obj.available_primary_key();
        address.user        = _user;
        address.dna         = _dna;
        address.message     = _message;
        address.timestamp   = now();
      });

    }

    // This is a simple action for estimating carbo
    // We will change this to validate the hash of the DNA with
    // a list of authorised parties and additionally
    // use the latitude / longitude for estimating real carbon
    // usage.

    /// @abi action
    void carbon(std::string& _dna ) {

      treetable obj(_self, _self); // code, scope

      float carbon = 0.0;
      auto itr = obj.begin();
      while (itr != obj.end()) {
	if (itr->dna == _dna) {
	  carbon += 1000;
	}
	itr++;
      }
      std::string message = std::string("carbon estimated at ") + std::to_string(carbon) + "\n";
      print(message);
    }

};

// specify the contract name, and export a public action: update
EOSIO_ABI( treechain, (insert)(carbon) )
