// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {
    enum State {
        DefaultState,
        Created,
        RevertedTraderToBuyer,
        RevertedBuyerToTrader,
        ConfirmedTraderToBuyer,
        AcceptedTrader,
        FoundSupplier,
        RevertedSupplierToTrader,
        RevertedTraderToSupplier,
        ConfirmedSupplierToTrader,
        RejectedSupplier,
        AcceptedSupplier,
        MaterialSourced,
        InFactory,
        QualityControl,
        ProductionCompleted,
        FoundShippingLine,
        AddedAmountShippingLine,
        RevertedSupplierToShippingLine,
        RevertedShippingLineToSupplier,
        ConfirmedShippingLineToSupplier,
        RejectedShippingLine,
        AcceptedShippingLine,
        BlUploaded,
        Shipped,
        DocumentsVerifiedByTrader,
        DocumentsUpdatedByTrader,
        DocumentsVerifiedByBuyer,
        Closed
    }

    enum Unit {
        piece,
        yard,
        metricTon,
        litres,
        kilogram,
        barrel,
        cubicMetre
    }

    struct Order {
        address supplier;
        address trader;
        address buyer;
        uint256 amountToTrader;
        uint256 amountToSupplier;
        uint256 amountToShippingLine;
        string BL;
        string PL;
        uint256 percentAdvanceForTrader;
        uint256 percentAdvanceForSupplier;
        State state;
        string invoice;
        string commodity;
        uint256 quantity;
        uint256 finalQuantity;
        address shippingLine;
        Unit unit;
    }

    mapping(bytes32 => Order) private hashToOrder;
    mapping(address => bytes32[]) private buyersToHashes;
    mapping(bytes32 => uint256) private buyerHashesToIndexes;
    mapping(address => bytes32[]) private suppliersToHashes;
    mapping(bytes32 => uint256) private supplierHashesToIndexes;
    mapping(address => bytes32[]) private tradersToHashes;
    mapping(bytes32 => uint256) private traderHashesToIndexes;
    mapping(address => bytes32[]) private shippingLinesToHashes;
    mapping(bytes32 => uint256) private shippingLinesHashesToIndexes;
    mapping(address => bool) public buyers;
    mapping(address => bool) public suppliers;
    mapping(address => bool) public traders;
    mapping(address => bool) public shippingLines;

    // done to reduce contract size
    function _onlyTrader() private view {
        require(traders[msg.sender]);
    }

    function _onlySupplier() private view {
        require(suppliers[msg.sender]);
    }

    function _onlySupplierOrShippingLine() private view {
        require(suppliers[msg.sender] || shippingLines[msg.sender]);
    }

    function _onlyUser() private view {
        require(
            suppliers[msg.sender] ||
                traders[msg.sender] ||
                shippingLines[msg.sender] ||
                buyers[msg.sender]
        );
    }

    function _notNegative(uint256 val) private pure {
        require(val >= 0);
    }

    function _greaterThanZero(uint256 val) private pure {
        require(val > 0);
    }

    function _canGetBuyer() private view {
        require(shippingLines[msg.sender] || traders[msg.sender]);
    }

    function _onlySupplierOrTrader() private view {
        require(suppliers[msg.sender] || traders[msg.sender]);
    }

    function _onlyBuyer() private view {
        require(buyers[msg.sender]);
    }

    function _onlyShippingLine() private view {
        require(shippingLines[msg.sender]);
    }

    function _onlyTraderOrShippingLine() private view {
        require(shippingLines[msg.sender] || traders[msg.sender]);
    }

    function _onlyBuyerOrTrader() private view {
        require(traders[msg.sender] || buyers[msg.sender]);
    }

    function _notAccountCreated() private view {
        require(
            !traders[msg.sender] &&
                !suppliers[msg.sender] &&
                !buyers[msg.sender] &&
                !shippingLines[msg.sender]
        );
    }

    modifier onlyTrader() {
        _onlyTrader();
        _;
    }

    modifier onlySupplier() {
        _onlySupplier();
        _;
    }

    modifier onlySupplierOrShippingLine() {
        _onlySupplierOrShippingLine();
        _;
    }

    modifier onlyUser() {
        _onlyUser();
        _;
    }

    modifier notNegative(uint256 val) {
        _notNegative(val);
        _;
    }

    modifier greaterThanZero(uint256 val) {
        _greaterThanZero(val);
        _;
    }

    modifier canGetBuyer() {
        _canGetBuyer();
        _;
    }

    modifier onlySupplierOrTrader() {
        _onlySupplierOrTrader();
        _;
    }

    modifier onlyBuyer() {
        _onlyBuyer();
        _;
    }

    modifier onlyShippingLine() {
        _onlyShippingLine();
        _;
    }

    modifier onlyTraderOrShippingLine() {
        _onlyTraderOrShippingLine();
        _;
    }

    modifier onlyBuyerOrTrader() {
        _onlyBuyerOrTrader();
        _;
    }

    modifier notAccountCreated() {
        _notAccountCreated();
        _;
    }

    function signUpBuyer() external notAccountCreated {
        buyers[msg.sender] = true;
    }

    function signUpTrader() external notAccountCreated {
        traders[msg.sender] = true;
    }

    function signUpSupplier() external notAccountCreated {
        suppliers[msg.sender] = true;
    }

    function signUpShippingLine() external notAccountCreated {
        shippingLines[msg.sender] = true;
    }

    function createOrder(
        bytes32 hash,
        uint256 amountToTrader, // in gwei
        address trader,
        uint256 percentAdvanceForTrader, // will be divided by hundred when used
        string memory commodity,
        uint256 quantity,
        Unit unit
    )
        external
        onlyBuyer
        notNegative(percentAdvanceForTrader)
        greaterThanZero(amountToTrader)
    {
        Order memory order = Order(
            address(0),
            trader,
            msg.sender,
            amountToTrader,
            0,
            0,
            "",
            "",
            percentAdvanceForTrader,
            0,
            State.Created,
            "",
            commodity,
            quantity,
            0,
            address(0),
            unit
        );
        hashToOrder[hash] = order;
        buyersToHashes[msg.sender].push(hash);
        buyerHashesToIndexes[hash] = buyersToHashes[msg.sender].length - 1;
        tradersToHashes[trader].push(hash);
        traderHashesToIndexes[hash] = tradersToHashes[trader].length - 1;
    }

    function acceptOrderTrader(bytes32 hash) external onlyBuyer {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.RevertedTraderToBuyer ||
                order.state == State.ConfirmedTraderToBuyer
        );
        order.state = State.AcceptedTrader;
        // Transaction logic for when there is advance payment handled in javascript
    }

    function rejectOrderBuyerOrTrader(
        bytes32 hash,
        address buyer,
        address trader
    ) external onlyBuyerOrTrader {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.Created ||
                order.state == State.RevertedTraderToBuyer ||
                order.state == State.RevertedBuyerToTrader
        );
        delete hashToOrder[hash];
        delete buyersToHashes[buyer][buyerHashesToIndexes[hash]];
        delete tradersToHashes[trader][traderHashesToIndexes[hash]];
    }

    function revertOrderBuyerOrTrader(
        bytes32 hash,
        uint256 amountToTrader,
        uint256 percentAdvanceForTrader
    )
        external
        onlyBuyerOrTrader
        notNegative(percentAdvanceForTrader)
        greaterThanZero(amountToTrader)
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.Created ||
                order.state == State.RevertedBuyerToTrader ||
                order.state == State.RevertedTraderToBuyer
        );
        order.amountToTrader = amountToTrader;
        order.percentAdvanceForTrader = percentAdvanceForTrader;
        order.state = order.state == State.RevertedBuyerToTrader ||
            order.state == State.Created
            ? State.RevertedTraderToBuyer
            : State.RevertedBuyerToTrader;
    }

    function confirmOrderTraderToBuyer(bytes32 hash) external onlyTrader {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.Created ||
                order.state == State.RevertedBuyerToTrader
        );
        order.state = State.ConfirmedTraderToBuyer;
    }

    function getCommodityAndQuantity(bytes32 hash)
        external
        view
        onlyUser
        returns (
            string memory,
            uint256,
            uint256,
            Unit
        )
    {
        return (
            hashToOrder[hash].commodity,
            hashToOrder[hash].quantity,
            hashToOrder[hash].finalQuantity,
            hashToOrder[hash].unit
        );
    }

    function addSupplierToOrder(
        address supplier,
        uint256 amountToSupplier,
        uint256 percentAdvanceForSupplier,
        bytes32 hash
    )
        external
        onlyTrader
        notNegative(percentAdvanceForSupplier)
        greaterThanZero(amountToSupplier)
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.AcceptedTrader ||
                order.state == State.RejectedSupplier
        );
        order.amountToSupplier = amountToSupplier;
        order.percentAdvanceForSupplier = percentAdvanceForSupplier;
        order.supplier = supplier;
        suppliersToHashes[supplier].push(hash);
        supplierHashesToIndexes[hash] = suppliersToHashes[supplier].length - 1;
        order.state = State.FoundSupplier;
    }

    function acceptOrderSupplier(bytes32 hash) external onlyTrader {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.RevertedSupplierToTrader ||
                order.state == State.ConfirmedSupplierToTrader
        );
        order.state = State.AcceptedSupplier;
        // Transaction logic for when there is advance payment handled in javascript
        // calculate total amount with amount per unit * quantity
    }

    function rejectOrderSupplierOrTrader(bytes32 hash, address supplier)
        external
        onlySupplierOrTrader
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.FoundSupplier ||
                order.state == State.RevertedTraderToSupplier ||
                order.state == State.RevertedSupplierToTrader
        );
        order.state = State.RejectedSupplier;
        delete suppliersToHashes[supplier][supplierHashesToIndexes[hash]];
    }

    function revertOrderSupplierOrTrader(
        bytes32 hash,
        uint256 amountToSupplier,
        uint256 percentAdvanceForSupplier
    )
        external
        onlySupplierOrTrader
        notNegative(percentAdvanceForSupplier)
        greaterThanZero(amountToSupplier)
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.FoundSupplier ||
                order.state == State.RevertedSupplierToTrader ||
                order.state == State.RevertedTraderToSupplier
        );
        order.amountToSupplier = amountToSupplier;
        order.percentAdvanceForSupplier = percentAdvanceForSupplier;
        order.state = order.state == State.RevertedTraderToSupplier ||
            order.state == State.FoundSupplier
            ? State.RevertedSupplierToTrader
            : State.RevertedTraderToSupplier;
    }

    function confirmOrderSupplierToTrader(bytes32 hash) external onlySupplier {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.FoundSupplier ||
                order.state == State.RevertedTraderToSupplier
        );
        order.state = State.ConfirmedSupplierToTrader;
    }

    function getAmountToTrader(bytes32 hash)
        external
        view
        onlyBuyerOrTrader
        returns (uint256)
    {
        return hashToOrder[hash].amountToTrader;
    }

    function getAmountToSupplier(bytes32 hash)
        external
        view
        onlySupplierOrTrader
        returns (uint256)
    {
        return hashToOrder[hash].amountToSupplier;
    }

    function getAmountToShippingLine(bytes32 hash)
        external
        view
        onlySupplierOrShippingLine
        returns (uint256)
    {
        return hashToOrder[hash].amountToShippingLine;
    }

    function getSupplier(bytes32 hash)
        external
        view
        onlyTraderOrShippingLine
        returns (address)
    {
        return hashToOrder[hash].supplier;
    }

    function getBuyer(bytes32 hash)
        external
        view
        canGetBuyer
        returns (address)
    {
        return hashToOrder[hash].buyer;
    }

    function getTrader(bytes32 hash) external view onlyUser returns (address) {
        return hashToOrder[hash].trader;
    }

    function getShippingLine(bytes32 hash)
        external
        view
        onlySupplier
        returns (address)
    {
        return hashToOrder[hash].shippingLine;
    }

    function getAdvancePercentForTrader(bytes32 hash)
        external
        view
        onlyBuyerOrTrader
        returns (uint256)
    {
        return hashToOrder[hash].percentAdvanceForTrader;
    }

    function getAdvancePercentForSupplier(bytes32 hash)
        external
        view
        onlySupplierOrTrader
        returns (uint256)
    {
        return hashToOrder[hash].percentAdvanceForSupplier;
    }

    function updateStateBySupplier(bytes32 hash, bytes32 update)
        external
        onlySupplier
    {
        Order storage order = hashToOrder[hash];
        require(order.state >= State.AcceptedSupplier);
        if (update == keccak256(bytes("MaterialSourced"))) {
            order.state = State.MaterialSourced;
        } else if (update == keccak256(bytes("InFactory"))) {
            order.state = State.InFactory;
        } else if (update == keccak256(bytes("QualityControl"))) {
            require(
                order.state != State.MaterialSourced &&
                    order.state != State.AcceptedSupplier
            );
            order.state = State.QualityControl;
        }
    }

    function updateStateByBuyer(bytes32 hash, bytes32 update)
        external
        onlyBuyer
    {
        Order storage order = hashToOrder[hash];
        if (update == keccak256(bytes("DocumentsVerifiedByBuyer"))) {
            require(order.state == State.DocumentsUpdatedByTrader);
            order.state = State.DocumentsVerifiedByBuyer;
        } else if (update == keccak256(bytes("Closed"))) {
            require(order.state == State.DocumentsVerifiedByBuyer);
            order.state = State.Closed;
        }
    }

    function updateStateByTrader(bytes32 hash, bytes32 update)
        external
        onlyTrader
    {
        // should only be able to set state as DocumentsVerifiedByTrader
        if (update == keccak256(bytes("DocumentsVerifiedByTrader"))) {
            Order storage order = hashToOrder[hash];
            require(order.state == State.Shipped);
            order.state = State.DocumentsVerifiedByTrader;
        }
    }

    function getState(bytes32 hash) external view onlyUser returns (State) {
        return hashToOrder[hash].state;
    }

    function uploadBL(bytes32 hash, string memory BL)
        external
        onlyShippingLine
    {
        Order storage order = hashToOrder[hash];
        require(order.state == State.AcceptedShippingLine);
        order.BL = BL;
        order.state = State.BlUploaded;
    }

    function ship(bytes32 hash) external onlyShippingLine {
        require(hashToOrder[hash].state == State.BlUploaded);
        hashToOrder[hash].state = State.Shipped;
        // after this point, in JS there is a transaction between supplier and shipping line: supplier -> shipping line
    }

    function onProductionComplete(
        string memory PL,
        string memory invoice,
        uint256 finalQuantity,
        bytes32 hash
    ) external onlySupplier {
        Order storage order = hashToOrder[hash];
        require(order.state == State.QualityControl);
        order.state = State.ProductionCompleted;
        order.PL = PL;
        order.invoice = invoice;
        // check for final quantity validity in JS
        order.finalQuantity = finalQuantity;
    }

    function getDocumentsFromSupplier(bytes32 hash)
        external
        view
        onlyShippingLine
        returns (
            string memory,
            string memory,
            string memory
        )
    {
        Order storage order = hashToOrder[hash];
        require(order.state == State.AcceptedShippingLine);
        return (order.PL, order.BL, order.invoice);
        // calculate total amount with amount per unit * quantity - advance payment
    }

    function getDocumentsFromShippingLine(bytes32 hash)
        external
        view
        onlyTrader
        returns (
            string memory,
            string memory,
            string memory
        )
    {
        Order storage order = hashToOrder[hash];
        require(order.state >= State.Shipped);
        return (order.PL, order.BL, order.invoice);
    }

    function updateDocumentsFromSupplier(
        string memory invoice,
        string memory PL,
        string memory BL,
        bytes32 hash
    ) external onlyTrader {
        // FOLLOWING FUNCTIONALITY HAPPENS AFTER TRADER VERIFIES DOCUMENTS
        // in JS state is set to DocumentsVerifiedByTrader
        // Transaction logic handled in javascript: trader to supplier
        Order storage order = hashToOrder[hash];
        require(order.state == State.DocumentsVerifiedByTrader);
        order.invoice = invoice;
        order.PL = PL;
        order.BL = BL;
        order.state = State.DocumentsUpdatedByTrader;
    }

    function getDocumentsFromTrader(bytes32 hash)
        external
        view
        onlyBuyer
        returns (
            string memory,
            string memory,
            string memory
        )
    {
        // At this point, in Javascript, Supplier has set the state to be "Shipped".
        Order memory order = hashToOrder[hash];
        require(order.state >= State.DocumentsUpdatedByTrader);
        return (order.PL, order.BL, order.invoice);
        // FOLLOWING FUNCTIONALITY HAPPENS AFTER BUYERS VERIFIES DOCUMENTS
        // when buyer verifies documents, state is set to DocumentsReceivedByBuyer
        // Transaction logic(of sending money to trader) handled in javascript: buyer to trader
        // after that, state is set to closed.
        // calculate total amount with amount per unit * quantity - advance payment
    }

    function getHashesForBuyer()
        external
        view
        onlyBuyer
        returns (bytes32[] memory)
    {
        return buyersToHashes[msg.sender];
    }

    function getHashesForSupplier()
        external
        view
        onlySupplier
        returns (bytes32[] memory)
    {
        return suppliersToHashes[msg.sender];
    }

    function getHashesForTrader()
        external
        view
        onlyTrader
        returns (bytes32[] memory)
    {
        return tradersToHashes[msg.sender];
    }

    function getHashesForShippingLine()
        external
        view
        onlyShippingLine
        returns (bytes32[] memory)
    {
        return shippingLinesToHashes[msg.sender];
    }

    function addShippingLineToOrder(address shippingLine, bytes32 hash)
        external
        onlySupplier
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.ProductionCompleted ||
                order.state == State.RejectedShippingLine
        );
        order.shippingLine = shippingLine;
        shippingLinesToHashes[shippingLine].push(hash);
        shippingLinesHashesToIndexes[hash] =
            shippingLinesToHashes[shippingLine].length -
            1;
        order.state = State.FoundShippingLine;
    }

    function acceptOrderShippingLine(bytes32 hash) external onlySupplier {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.RevertedShippingLineToSupplier ||
                order.state == State.ConfirmedShippingLineToSupplier ||
                order.state == State.AddedAmountShippingLine
        );
        order.state = State.AcceptedShippingLine;
    }

    function addAmountShippingLine(bytes32 hash, uint256 amountToShippingLine)
        external
        onlyShippingLine
        greaterThanZero(amountToShippingLine)
    {
        Order storage order = hashToOrder[hash];
        require(order.state == State.FoundShippingLine);
        order.amountToShippingLine = amountToShippingLine;
        order.state = State.AddedAmountShippingLine;
    }

    function rejectOrderShippingLine(bytes32 hash, address shippingLine)
        external
        onlySupplierOrShippingLine
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.FoundShippingLine ||
                order.state == State.RevertedSupplierToShippingLine ||
                order.state == State.RevertedShippingLineToSupplier ||
                order.state == State.AddedAmountShippingLine
        );
        order.state = State.RejectedShippingLine;
        // shippingLinesToHashes[shippingLine][
        //     shippingLinesHashesToIndexes[hash]
        // ] = shippingLinesToHashes[shippingLine][
        //     shippingLinesToHashes[shippingLine].length - 1
        // ];
        // shippingLinesToHashes[shippingLine].pop();
        delete shippingLinesToHashes[shippingLine][
            shippingLinesHashesToIndexes[hash]
        ];
    }

    function revertOrderShippingLine(bytes32 hash, uint256 amountToShippingLine)
        external
        onlySupplierOrShippingLine
        greaterThanZero(amountToShippingLine)
    {
        Order storage order = hashToOrder[hash];
        require(
            order.state == State.RevertedSupplierToShippingLine ||
                order.state == State.RevertedShippingLineToSupplier ||
                order.state == State.AddedAmountShippingLine
        );
        order.amountToShippingLine = amountToShippingLine;
        order.state = (order.state == State.RevertedSupplierToShippingLine)
            ? State.RevertedShippingLineToSupplier
            : State.RevertedSupplierToShippingLine;
    }

    function confirmOrderShippingLineToSupplier(bytes32 hash)
        external
        onlyShippingLine
    {
        Order storage order = hashToOrder[hash];
        require(order.state == State.RevertedSupplierToShippingLine);
        order.state = State.ConfirmedShippingLineToSupplier;
    }
}
