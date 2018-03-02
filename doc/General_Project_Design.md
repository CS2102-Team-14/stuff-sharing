### (1) Login / Crate account Page  
-   **Login (page &rarr; 2)** *upon successful login*
-   **Create Account (page &rarr; 5)**
    -   Everyone must create an account to use the service
        (simplifies project)
    -   Username, password, general location (south, west, east, north,
        central), Address, phone number

### (2) Home Page:
-   **Display Items currently being lent by you** (item name, borrower
    name, borrower phone number, price received, return date)
    -   on the return date, the item will be automatically removed from this list and asssumed to have been returned 
-   **Display status of items you wish to lend** (item name, borrower
    name, borrower phone number, return date, LoanOut price, offered price, lent
    / accept)
    -   An offered price is successful when someone offers a price &gt;=
        your item’s LoanOut price. Once a bid is successful the item
        owner can *“Mark as Lent”* meaning that your item has been loaned
        (you physically gave away the product)
    -   Other offered prices (bids) lower than the LoanOut price may be
        accepted by the owner manually, and then marked at
        Lent subsequently. (only the current highest bid will
        be displayed)
    -   Once an offer is accepted by the lender, the item will be
        removed from the general list of items being offered in the home
        page (*see below*)
    -   *Table below attempts to illustrate this:*

| Item name | Borrower name  | Borrower phone number | LoanOut price | Offered price | Accept / Lent  |
|-----------|----------------|-----------------------|---------------|---------------|----------------|
| Scissors  | Bobby Tortilla | 54423232              | 4             | 4             | _Mark as Lent_ |
| Fanta      | Scooby Doo     | 43553522              | 22            | 17            | _Accept offer_ |

-   **Display status of your current bids** (item name, lender name,
    LoanOut price, your offer (bid), accepted / loaned)
    -   An item is marked as *“Accepted”* if your offer &gt;= LoanOut
        price OR if the owner accepts it manually
    -   An item is marked as *“Loaned”* if the owner has physically given
        you the item after having accepted your offer
-   **Display all Items being offered in your area** as a list (default)
    -   Search for items being offered (by name, category or area)
    -   Select an item to borrow (page &rarr; 3)
-   **Add an item to lend** (page &rarr; 4)
-   **Change Account details** (page &rarr; 5)
-   **Display interesting information** (complex queries to be decided)

### (3) Item to borrow Page:
-   Display Item particulars (name, location, borrower name, borrower
    phone number, return date, LoanOut price, current highest bid)
-   Place your bid

### (4) Add item to lend Page:

-   Enter item particulars (name, category, return date, LoanOut price)
    -   Location will be attached automatically based on user’s account
        location

### (5) Change Account Details:

-   Update your account fields (name, address, phone number etc.)
-   Invalid if some fields are missing

