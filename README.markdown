# Usage:

        new Ext.ux.Sparkline({renderTo:Ext.getBody(),values:[1,2,3,234,345,56,563,34,134,45,456,542]});

        new Ext.grid.GridPanel({
            renderTo:Ext.getBody(),
            autoHeight:true,
            width:250,
            title:'Sparklines',
            view : new Ext.grid.GridView({forceFit : true}),
            
            columns: [{
                    header: 'Name',
                    dataIndex: 'name'
                },{
                    header: 'Stats',
                    xtype:'sparklinecolumn',
                    dataIndex: 'stats',
                    sparkline:{ type:'bar', barColor:"green" } // default sparkline config for the column
            }],

            plugins:[new Ext.ux.Sparkline.GridPlugin()],

            store:new Ext.data.SimpleStore({
                fields:['name', 'stats'],
                data: [
                    ['bar (default cfg)', {values:[10,-2,30,10,100,40,6,78,23]}],
                    ['line', {
                        // the record can override the default cell config:
                        values:[10,-2,30,10,100,40,6,78,23],
                        type:'line',
                        maxSpotColor:'red'
                    }],
                    ['box', {values:[1,2,3,10,1,4,6,78,23],type:'box'}],
                    ['tristate', {values:[100,50,-13,0,1,4,6,0,-345,345,34,-43,56,7,23],type:'tristate'}],
                    ['discrete', {values:[100,-50,13,345,345,345,34,23,12,56,7,23],type:'discrete'}],
                    ['pie', {values:[10,50,40],type:'pie'}],
                    ['bullet', {values:[10,12,12,9,7],type:'bullet'}]
                ]
            })
        });

