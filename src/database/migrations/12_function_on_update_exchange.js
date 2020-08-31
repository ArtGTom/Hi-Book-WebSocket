const ON_UPDATE_EXCHANGE_FUNCTION = 
    `
    CREATE OR REPLACE FUNCTION on_update_exchange()
        RETURNS trigger AS 
        $updateExchange$
            DECLARE first_user INT := OLD.cd_first_user::int;
            DECLARE first_book INT := OLD.cd_first_book::int;
            DECLARE first_confirmation VARCHAR(10) := NEW.nm_first_confirmation::varchar(10);
            DECLARE second_user INT := OLD.cd_second_user::int;
            DECLARE second_book INT := OLD.cd_second_book::int;
            DECLARE second_confirmation VARCHAR(10) := new.nm_second_confirmation::varchar(10);
            BEGIN
                IF first_confirmation = 'confirmado' and second_confirmation = 'confirmado' THEN
                    UPDATE tb_book
                        SET cd_status_book = 2
                        WHERE cd_book = first_book;
                    UPDATE tb_book
                        SET cd_status_book = 2
                        WHERE cd_book = second_book;
                    NEW.cd_status_exchange := 2;
                ELSIF first_confirmation = 'recusado' or second_confirmation = 'recusado' THEN
                    NEW.cd_status_exchange := 3;
                ELSIF first_confirmation = 'cancelado' or second_confirmation = 'cancelado' THEN
                    NEW.cd_status_exchange := 5;
                ELSIF first_confirmation = 'concluido' and second_confirmation = 'concluido' THEN
                    UPDATE tb_book
                        SET cd_user = second_user,
                        cd_status_book = 1
                        WHERE cd_book = first_book;
                    UPDATE tb_book
                        SET cd_user = first_user,
                        cd_status_book = 1
                        WHERE cd_book = second_book;
                    NEW.cd_status_exchange := 4;
                END IF;
                RETURN NEW;
            END;
        $updateExchange$ 
        LANGUAGE plpgsql
    `;

const DROP_ON_UPDATE_EXCHANGE_FUNCTION = `DROP FUNCTION on_update_exchange`

exports.up = knex => knex.raw(ON_UPDATE_EXCHANGE_FUNCTION);

exports.down = knex => knex.raw(DROP_ON_UPDATE_EXCHANGE_FUNCTION);