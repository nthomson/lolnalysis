function LolGame(replay) {
    this.replay = replay;
    this.players = this.replay.players;
    this.game_mode = this.replay.gameMode;
    this.match_type = this.replay.matchType;
    this.winning_team = this.replay.winningTeam;
    this.summoner_name = this.replay.summoner_name;
    this.uploader = get_player_by_summoner_name(this.summoner_name, this.players);
    


    this.initialize_overview = function(overview_selector, detail_selector) {
        var teams = [[],[]];
        $(overview_selector).find('.outcome').html("Team "+this.replay.winningTeam+" wins!");

        var players = this.players;
        var uploader = this.uploader;

        $.each(players, function(index, player){
            var player_listitem = getPlayer(players, player);
            $('#team'+player.team).append(player_listitem);
        });

        $(overview_selector).animate({width: "950px"}, function(){
            $(overview_selector).removeClass('loading');
            $(overview_selector).children().fadeIn(1000, function(){                
                update_details(detail_selector, players, uploader, true);
                $(detail_selector).slideDown(1000, function(){
                    update_details(detail_selector, players, uploader);
                });
            });
        });
    }
    
    function get_player_by_summoner_name(summoner_name, players) {
        for(var i = 0; i < players.length; i++){
            if(players[i].summonerName == summoner_name){
                return players[i];
            }
        }
    }

    function update_metrics(metrics, metrics_selector) {
        $.each(metrics, function(index, metric){
            if ($(metrics_selector).find('.'+metric.name+' .bar').length > 0) {
                $(metrics_selector).find('.'+metric.name+' .val').html(metric.value);
                $(metrics_selector).find('.'+metric.name+' .max').html(metric.max);
                $(metrics_selector).find('.'+metric.name+' .bar').css('width', metric.percent+'%');
                $('.metrics .'+metric.name).removeClass('progress-success progress-warning progress-danger').addClass(this.extra_class);
            }
            else {
                $(metrics_selector).append(metric.bar_out());
            }
        });
    }

    function update_details(details_selector, players, player, initial) {
        var player_pass = initial ? undefined : player;
        var metrics = get_metrics(players, player_pass);
        $(details_selector).find('.portrait img').attr('src', 'img/champions/120/'+player.champion.toLowerCase()+'.png');
        $(details_selector).find('.name').html(player.summoner + ' ('+player.champion+')');
        
        update_metrics(metrics, '.metrics');
    }

    function getPlayer(players, player) {
        var summoner_url = 'javascript:void(0)';
        var link_title = '{0} ({1})'.format(player.summoner, player.champion);
        var image_url = 'img/champions/120/{0}.png'.format(player.champion.toLowerCase());

        var player_link = $('<a>').attr('href', summoner_url).attr('title', link_title).click(function(){
            update_details('.detail', players, player);
        });

        var list_item = $('<li>').append(
            player_link.append(
                $('<img>').attr('src', image_url).attr('width', 60)
            )
        );
        
        return list_item;
    }

    function get_metrics(players, player) {
        var metric_list = [
            {"name":"kills", "label": "Kills", "reverse_colors":false},
            {"name":"deaths", "label": "Deaths", "reverse_colors":true},
            {"name":"assists", "label": "Assists", "reverse_colors":false},
            {"name":"damageDealt", "label": "Damage Dealt", "reverse_colors":false},
            {"name":"damageTaken", "label": "Damage Taken", "reverse_colors":true},
            {"name":"gold", "label": "Gold", "reverse_colors":false},
            {"name":"minions", "label": "Minions", "reverse_colors":false},
            {"name":"level", "label": "Level", "reverse_colors":false},
            {"name":"summonerLevel", "label": "Summoner Level", "reverse_colors":false}
        ];
        function Metric(players, player, metric){
            this.name = metric.name;
            this.label = metric.label;
            this.value = player ? player[metric.name] : 0;
            this.reverse_colors = metric.reverse_colors;
            this.max = players[0][metric.name];
            for(var i = 0; i < players.length; i++){
                if(players[i][metric.name] > this.max){
                    this.max = players[i][metric.name];
                }
            }
            this.percent = ((this.value/this.max) * 100.0) | 0;
            if(!this.reverse_colors){
                if(this.percent > 75){
                    this.extra_class = "progress-success"
                }
                else if(this.percent > 50) {
                    this.extra_class = "progress-warning"
                }
                else {
                    this.extra_class = "progress-danger"
                }
            }
            else {
                if(this.percent > 75){
                    this.extra_class = "progress-danger"
                }
                else if(this.percent > 50) {
                    this.extra_class = "progress-warning"
                }
                else {
                    this.extra_class = "progress-success"
                }
            }
            
            //TODO
            this.bar_out = function(){
                var bar_perc = this.percent;
                var bar_class = "progress " + this.extra_class;
                return '<div class="'+this.name+'">{0}: <span class="val">{1}</span>/<span class="max">{2}</span><div class="{3} {4}"><div class="bar" style="width: {5}%"></div></div></div>'.format(this.label, this.value, this.max, bar_class, this.name, this.percent);
            }
        }
        var metrics = new Array();
        for(var i = 0; i < metric_list.length; i++){
            metrics.push(new Metric(players, player, metric_list[i]));
        }
        return metrics;
    }
    
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
