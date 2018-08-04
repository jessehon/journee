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
//   isnewuser => to check if the given account name has tree in table or not
// Public actions:
//   update => put the tree into the multi-index table and sign by the given account

// Replace the contract class name when you start your own project
class treechain : public eosio::contract {
  private:
    bool isnewdna( std::string dna ) {
      treetable treeobj(_self, _self);
      // get object by secordary key
      auto trees = treeobj.get_index<N(getbydna)>();
      auto tree = trees.find(dna);

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
      // secondary key: user
      account_name get_by_user() const { return user; }
      std::string get_by_dna() const { return dna; }
    };

    // create a multi-index table and support secondary key
    typedef eosio::multi_index< N(treestruct), treestruct,
      indexed_by< N(getbydna), const_mem_fun<treestruct, account_name, &treestruct::get_by_dna> >
      > treetable;

  public:
    using contract::contract;

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

};

// specify the contract name, and export a public action: update
EOSIO_ABI( treechain, (insert) )
