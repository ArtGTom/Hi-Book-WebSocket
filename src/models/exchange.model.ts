export default interface Exchange {
    cd_exchange: number,
    cd_status_exchange: 1 | 2 | 3,
    cd_first_user: number,
    cd_first_book: number,
    nm_first_confirmation: 'pendente' | 'confirmado' | 'recusado' | 'concluido',
    cd_second_user: number,
    cd_second_book: number,
    nm_second_confirmation: 'pendente' | 'confirmado' | 'recusado' | 'concluido'
}