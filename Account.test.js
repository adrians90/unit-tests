
const Account = require("./Account")
const FileSystem = require("./FileSystem")


beforeEach(() => {
    jest.restoreAllMocks()
})

describe("#deposit", () => {
    test("it adds money to the account", async () => {
        const startingBalance = 5
        //Create an account with a name and balance
        const account = await createAccount("Adrian", startingBalance)
        const amount = 10
        const spy = jest.spyOn(FileSystem, "write").mockReturnValue(Promise.resolve())
        //Call the deposit method
        await account.deposit(amount)
        //Check the balance of the account
        expect(account.balance).toBe(amount + startingBalance)
        //Check the file is correct
        
        expect(spy).toBeCalledWith(account.filePath, amount + startingBalance)
        spy.mockRestore()

    })
})

describe("#withdraw", () => {
    test("It removes money from the accont", async () => {
        const startingBalance = 10
        //Create an account with a name and balance
        const account = await createAccount("Adrian", startingBalance)
        const amount = 5
        const spy = jest.spyOn(FileSystem, "write").mockReturnValue(Promise.resolve())
        //Call the deposit method
        await account.withdraw(amount)
        //Check the balance of the account
        expect(account.balance).toBe(startingBalance - amount)
        //Check the file is correct
        
        expect(spy).toBeCalledWith(account.filePath, startingBalance - amount)
    })

    describe("With not enough money in the account", () => {
        test("It should throw an error", async () => {
            const startingBalance = 5
        //Create an account with a name and balance
            
            const amount = 10
            const account = await createAccount("Adrian", startingBalance)
            const spy = jest.spyOn(FileSystem, "write")
        //Call the deposit method
            await expect(account.withdraw(amount)).rejects.toThrow()
        //Check the balance of the account
            expect(account.balance).toBe(startingBalance)
        //Check the file is correct
        
            expect(spy).not.toBeCalled()
        })
    })
})

async function createAccount(name, balance) {
    const spy = jest.spyOn(FileSystem, "read").mockReturnValueOnce(Promise.resolve(balance))
    const account = await Account.find(name)
    spy.mockRestore()
    return account
}