// Created by larobinson, 2021
// Copyright Bungie, Inc.
// tslint:disable: jsx-use-translation-function

import React from "react";
import { RouteHelper } from "../../Global/Routes/RouteHelper";
import { Anchor } from "../Navigation/Anchor";
import styles from "./ErrorBnetOffline.module.scss";

interface ErrorBnetOfflineProps {}

export const ErrorBnetOffline: React.FC<ErrorBnetOfflineProps> = (props) => {
  return (
    <div>
      <header>
        <Anchor
          className={styles.logo}
          url={RouteHelper.Home}
          style={{
            backgroundImage:
              'url("/img/theme/bungienet/bungie_logo_with_shield.svg")',
          }}
        />
      </header>
      <div className={styles.container}>
        <h1>Temporarily Offline for Maintenance</h1>
        <div className={styles.message}>
          <p>
            Bungie.net needs a little break. We're pampering it with some much
            deserved maintenance.
          </p>

          <p>
            Bungie.net a besoin de prendre une courte pause. Il se laisse
            présentement dorloter avec une maintenance bien méritée. Merci de
            repasser plus tard.
          </p>

          <p>
            Bungie.net necesita un respiro. Estamos dándole el cariño necesario
            para mantenerla en perfecto estado. Vuelve dentro de un rato.
          </p>

          <p>
            Bungie.net braucht 'ne kleine Pause. Wir päppeln es mit
            wohlverdienter Wartung.
          </p>

          <p>
            In questo momento Bungie.net si sta prendendo un (meritato) momento
            di pausa, causa lavori in corso. Vi preghiamo di essere pazienti.
          </p>

          <p>
            Bungie.net precisa de uma folga. Estamos mimando-a com uma merecida
            manutenção.
          </p>

          <p>
            Сайт Bungie.net устал и хочет немного отдохнуть. Мы решили
            побаловать его заслуженным техобслуживанием.
          </p>

          <p>
            Bungie.net potrzebuje krótkiej przerwy. Zasłużyło na chwilę relaksu
            w postaci przerwy technicznej.
          </p>

          <p>
            Bungie.netは一時休止中です。現在メンテナンス作業を行っています。
          </p>

          <p>Bungie.net需要休息一下。我们正在对其进行一些必要的维护。</p>

          <p>Bungie.net需要休息一下。我們正在執行必要的維護來呵護它。</p>

          <p>
            번지넷은 잠깐의 휴식이 필요합니다. 응당한 점검으로 번지넷에 충분한
            휴식을 제공하고 있습니다.
          </p>
        </div>
        <div className={styles.footer}>
          <p>
            <br />
            Temporarily Offline for Maintenance
          </p>
        </div>
      </div>
    </div>
  );
};
