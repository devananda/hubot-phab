var createCanduit = require('canduit');

var canduitConfig = {
    user: process.env.HUBOT_PHABRICATOR_USER,
    api: process.env.HUBOT_PHABRICATOR_API,
    cert: process.env.HUBOT_PHABRICATOR_CERT
};

module.exports = function(robot) {
    //CLOSE not working yet...
    robot.respond(/(?:^|[\[\s][Cc][Ll][Oo][Ss][Ee]\s?)([TDPQFV][0-9]+|r[A-Z]+[a-f0-9]+)(?:\s*(-v))?(?=\W|$)/g, function(msg) {
        console.log("close ",msg.match);
        createCanduit(canduitConfig, function(err, conduit) {
            if (err) {
                console.log("error:", err);
                return msg.send("ERROR: " + err);
            } else {
                var ref = msg.match;
                for (var i = 0; i < ref.length; i++) {
                    var match = ref[i];
                    console.log("match: ",match);
                    match = match.trim();
                    match = match.slice(1, match.length);
                    console.log("match final: ",match);
                    /*
                    conduit.exec('maniphest.update', {
                        id: Number(match),
                        status: "resolved",
                        comments: "closed by devbot (slack)"
                    }, function(error, results) {
                        if (error) {
                            console.log("error: ", error);
                            return;
                        } else {
                            return msg.send("Got it, closed!");
                        }
                    });
*/
                }
            }
        });
    });
    robot.hear(/(?:^|[\[\s])([TDPQFV][0-9]+|r[A-Z]+[a-f0-9]+)(?:\s*(-v))?(?=\W|$)/g, function(msg) {
        createCanduit(canduitConfig, function(err, conduit) {
            if (err) {
                console.log("error:", err);
                return msg.send("ERROR: " + err);
            } else {
                var names = (function() {
                    var ref = msg.match;
                    var results = [];
                    for (var i = 0; i < ref.length; i++) {
                        var match = ref[i];
                        results.push(match.trim());
                    }
                    return results;
                })();
                conduit.exec('phid.lookup', {
                    names: names
                }, function(error, result) {
                    if (error) {
                        console.log("error: ", error);
                        return msg.send("was an error: " + JSON.stringify(error));
                    } else {
                        var results = [];
                        var len = Object.keys(result).length;
                        for (var i = 0; i <= len; i++) {
                            if (i === len) {
                                if (results.length > 0) {
                                    return msg.send(results.join("\n"));
                                } else {
                                    return;
                                }
                            } else {
                                var info = result[Object.keys(result)[i]];
                                results.push("^ " + info.fullName + "(" + info.status + ") - " + info.uri);
                            }
                        }
                    }
                });
            }
        });

    });

    robot.respond(/show (.*) tasks/i, function(msg) {
        var username = msg.match[1];
        console.log("msg.match: ", msg.match);
        var brain_current = robot.brain.get("phab_alias");
        console.log("brain current", brain_current);
        if (brain_current !== null) {
            for (var k = 0; k <= Object.keys(brain_current).length; k++) {
                if (k === Object.keys(brain_current).length) {
                    console.log("using username: ", username);
                    createCanduit(canduitConfig, function(err, conduit) {
                        if (err) {
                            console.log("error:", err);
                            return msg.send("ERROR: " + err);
                        } else {
                            conduit.exec('user.query', {
                                usernames: [username]
                            }, function(error, results) {
                                if (error) {
                                    console.log("error: ", error);
                                    return;
                                } else {
                                    if (results.length === 1) {
                                        //results[0];
                                        conduit.exec('maniphest.query', {
                                            ownerPHIDs: [results[0].phid],
                                            status: "status-open"
                                        }, function(error2, results2) {
                                            if (error2) {
                                                console.log("error2: ", error2);
                                                return;
                                            } else {
                                                //var sendResults = ["Showing Open Tasks for "+results[0].realName + " ("+username+")"];
                                                msg.send("Showing Open Tasks for " + results[0].realName + " (" + username + ")");
                                                var keys = Object.keys(results2);
                                                for (var i = 0; i <= keys.length; i++) {
                                                    if (i === keys.length) {
                                                        return;
                                                    } else {
                                                        var info = results2[keys[i]];
                                                        //sendResults.push("* "+info.objectName+" - "+info.title + ": "+info.uri);
                                                        msg.send("* " + info.objectName + " - " + info.title + ": " + info.uri);
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        return;
                                    }
                                }
                            });
                        }
                    });
                } else {
                    if (brain_current[Object.keys(brain_current)[k]] === msg.match[1]) {
                        username = Object.keys(brain_current)[k];
                    }
                }
            }
        } else {
            createCanduit(canduitConfig, function(err, conduit) {
                if (err) {
                    console.log("error:", err);
                    return msg.send("ERROR: " + err);
                } else {
                    conduit.exec('user.query', {
                        usernames: [username]
                    }, function(error, results) {
                        if (error) {
                            console.log("error: ", error);
                            return;
                        } else {
                            if (results.length === 1) {
                                //results[0];
                                conduit.exec('maniphest.query', {
                                    ownerPHIDs: [results[0].phid],
                                    status: "status-open"
                                }, function(error2, results2) {
                                    if (error2) {
                                        console.log("error2: ", error2);
                                        return;
                                    } else {
                                        //var sendResults = ["Showing Open Tasks for "+results[0].realName + " ("+username+")"];
                                        msg.send("Showing Open Tasks for " + results[0].realName + " (" + username + ")");
                                        var keys = Object.keys(results2);
                                        for (var i = 0; i <= keys.length; i++) {
                                            if (i === keys.length) {
                                                return;
                                            } else {
                                                var info = results2[keys[i]];
                                                //sendResults.push("* "+info.objectName+" - "+info.title + ": "+info.uri);
                                                msg.send("* " + info.objectName + " - " + info.title + ": " + info.uri);
                                            }
                                        }
                                    }
                                });
                            } else {
                                return;
                            }
                        }
                    });
                }
            });
        }
    });

    robot.respond(/set (.*) as alias for (.*)/i, function(msg) {
        var brain_current = robot.brain.get("phab_alias");
        if (brain_current === null) {
            brain_current = {};
        }
        brain_current[msg.match[2]] = msg.match[1];
        robot.brain.set("phab_alias", brain_current);
        return msg.send("Ok, I'll remember " + msg.match[2] + " is also known as " + msg.match[1]);
    });
    robot.respond(/get alias for (.*)/i, function(msg) {
        var brain_current = robot.brain.get("phab_alias");
        if (brain_current === null) {
            return msg.send(msg.match[1] + " does not have any aliases...");
        } else {
            if (Object.keys(brain_current).indexOf(msg.match[1]) > -1) {
                return msg.send(msg.match[1] + " is also known as " + brain_current[msg.match[1]]);
            } else {
                return msg.send(msg.match[1] + " does not have any aliases...");
            }
        }
    });
};
