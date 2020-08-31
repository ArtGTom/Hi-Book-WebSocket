import { ViewStatusExchange } from "./statusExchangeView.model";
import { ViewBook } from "./bookOperations.mode";

export interface NewExchange {
    requestedBookId: number,
    trader: string,
}

export interface ViewExchange {
    id: number,
    status: ViewStatusExchange,
    requestedBook: ViewBook,
    myConfirmation: "pendente" | "confirmado" | "concluido" | "recusado",
    trader: {
        name: string,
        username: string,
        image: string,
    },
    traderBook?: ViewBook,
    traderConfirmation: string
}