## PayWhich Currency Tool

The back-end tool for [PayWhich.pw](http://PayWhich.pw). This tool will retrive the selected currency exchange rate with the base currency of NTD from international credit card organizations. Currently supporting VISA, Mastercard and JCB.

## Features

1. Command line tool to retrive VISA currency
    - ``visa.js``
    - ``visa-headless.js`` (with PhantomJS headless browser)
2. Command line tool to retrive MasterCard currency
    - ``master.js``
3. Command line tool to retrive JCB currency
    - ``jcb.js``

## Install

    git clone https://github.com/jeremy5189/payWhich.git
    cd payWhich
    npm install
    
    # Edit config.json to configure mysql password
    cp config.sample.json config.json    
    vim config.json
    
    # Create Table
    mysqldump -u [user] -p [db_name] < paywhich.sql

## Usage

You are required to specific the target currency (usually the country where your card was charged), and the day offset from today. (Target currency list could be edit in ``config.json``)

For day offset. VISA can be set to 0 (They offser currency exchange rate everyday). MasterCard and JCB should be set to 1. PayWhich will not insert anything to your database if **no currency is retrived** or the debug tag ``-v`` is presented.

    # VISA
    node visa.js 0 USD [-v]

    # VISA with PhantomJS (If your IP was banned by VISA)
    phantomjs visa-headless.js 0 USD [-v]
    
    # MasterCard 
    node master.js 1 USD [-v]

    ## JCB (No target currency is required)
    node jcb.js 1 [-v]

## Setting up crontab

    node crontab-gen.js [--headless] [--nocron]

