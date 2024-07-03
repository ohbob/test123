// Configuration ----------------------------------------------------------------------------------------------
var Bow = '0x401C0CB1'; //Оружие
const CargoHold = '0x401B1E7A'; //Номер вашего грузового отсека

// DO NOT EDIT AFTER THIS POINT ------------------------------------------------------------------------

var range = 3;
var fakeObjType = "0x0E76";
var fishingPoleType = "0x0DBF";
var knifeType = "0x13F6"; // Skinning Knife
var food = '0x097B'; //id еды (в данном случае fish steak)


const FishingItems = [
	   {name: 'Fish', graphic:'0x09CD', color: '0x0000'},
	   {name: 'Fish', graphic:'0x09CE', color: '0x0000'},
	   {name: 'Fish', graphic:'0x09CF', color: '0x0000'},
	   {name: 'Fish', graphic:'0x09CC', color: '0x0000'},
	   {name: 'Sulfurous Ash', graphic:'0x0F8C', color: '0x0000'},
	   {name: 'Bloodmoss', graphic:'0x0F7B', color: '0x0000'},
	   {name: 'Mandrake Root', graphic:'0x0F86', color: '0x0000'},
	   {name: 'Black Pearl', graphic:'0x0F7A', color: '0x0000'},
	   {name: 'Garlic', graphic:'0x0F84', color: '0x0000'},
	   {name: 'Nightshade', graphic:'0x0F88', color: '0x0000'},
	   {name: 'Spiders Silk', graphic:'0x0F8D', color: '0x0000'},
	   {name: 'Pumice', graphic:'0x0F8B', color: '0x0000'},
];

 var CurrentStatus = 'Starting';
// Main Loop ----------------------------------------------------------------------------------------------
function AutoFishing(){
	Orion.Wait(2000);
	CreateStatusGump();
    while(!Player.Dead())
    {
        FishingLoop();
        CurrentStatus = 'Fishing';
        CreateStatusGump();
        Orion.Wait(9000);        
        var target = GetNearestTarget();
            if(target.length >0 )
            {
                CurrentStatus = 'Fighting';
        		CreateStatusGump();
                EquipBow();
                while(target.length >0)
                {
                        target.forEach(function(enemy)
                        {
                        Orion.Attack(enemy.Serial());    
                        CurrentStatus = 'Fighting';
        				CreateStatusGump();
                              Orion.Wait(1500);
                                  if(enemy.Dead()){return;}
                              }); //end forEach
                        target = GetNearestTarget();
                 }//end while
                 //CutCorpse();
                 Orion.Wait(2500);
                 //CutLeaterHides();
             } //end If target
        Orion.Wait(500);
        UnloadItems();

    } //end While PlayerDead
}// End function

 
// Support Functions ----------------------------------------------------------------------------------------------    
function  FishingLoop()
{

    var findMsg, stopWeight = 600, maxWeight = 620;
    var retryMsg = 'You fish a while|You put the|Вы поранились|Вы кладёте|Вы некоторое время ловите рыбу';
    var stopMsg = 'There are no fish here|is too far|Target is not in line of sight|not be seen|Цель находится вне прямой|Здесь нет рыбы';
    	Orion.Wait(1000);
        Orion.Say('Full Forward');//'Full Forward'
    	Orion.Wait(3000);
        Orion.Say('Stop'  );//'Stop'
    var type = 'any'; //set to 'water' in order to fish from land.
    var locations=[];
	var locCounter=0;
    var msgWait = 5000;
    Orion.ClearFakeMapObjects();
    for(i=(Player.X()-range);i<(Player.X()+range+1);i++)
    {
		for(j=(Player.Y()-range);j<(Player.Y()+range+1);j++)
        {
            if(Orion.ValidateTargetTile(type, i, j))
            
                locations[locCounter]=[];
                locations[locCounter][0]=i;
                locations[locCounter][1]=j;
                Orion.AddFakeMapObject(locCounter, fakeObjType, '0x048C', i,j,Player.Z()+2)
                locCounter++
            }
        }
    }
	for(var l=0; l<locations.length; l++)
	{ 
            {
            if (Player.Weight() >= stopWeight){   
                UnloadItems()  
             }
             {   
        while(!Player.Dead())
        {
            while(!Player.Dead())
            {
                Orion.WaitTargetTile(type, locations[l][0], locations[l][1],255);
                if (!Orion.UseType(fishingPoleType))
                {
                    Orion.Print("NO FISHING POLE");
                    Orion.CancelWaitTarget();
                    return;
                }
                if(!Orion.WaitJournal('What do you want to use the|Для чего вы хотите использовать', Orion.Now(), Orion.Now() + 500, 'sys')){
                    Orion.Wait(150);
                    continue;
                } else {
                    break;
                }
            }

            Orion.AddFakeMapObject(l, fakeObjType, '0x002B', locations[l][0], locations[l][1],Player.Z()+2)
            var msg = Orion.WaitJournal(stopMsg + '|' + retryMsg, Orion.Now(), Orion.Now() + msgWait, "my|sys");
            if(msg == null || !msg.Text().match(retryMsg))
            {
				Orion.Print('Bad spot, skipping.')
				break;
            } else {
                Orion.Print('Fish again...');
            }
        }                        
    }
}
  
function UnloadItems()
{
// Выгрузить улов
	FishingItems.forEach( function(gem) {
		unloadItemsByType(gem.graphic, gem.color, gem.name); 
		});
	Orion.Wait(500);
	
	
}

function unloadItemsByType(graphic, color, itemName){
	//var secureContainer = Orion.GetSerial(Secure);
	
	var items = Orion.FindType(graphic, color, 'backpack');
		items.forEach(function(itemSerial) {
			Orion.MoveItem(itemSerial, -1, CargoHold);
			Orion.Wait('500');
			});
}

function UnloadTest()
{
	var findItems0 = Orion.FindType('0x0E75', '0x0000', 'backpack', 'item|fast|recurse');
	if (findItems0.length())
	{
		Orion.DragItem(findItems0[0], 1);
		Orion.Wait('300');
	}
	Orion.DropDraggedItem('0x401B1E7A', 69, 74);//контейнер
	Orion.Wait('500');
}

// Handle Sea Serpents ----------------------------------------------------------------------------------------------

function CheckForEnemy() {

}

function AttackNearest() {
  const target = GetNearestTarget();
  if (!target) {
  return false;
  }
  Orion.CharPrint(Player.Serial(), '0000FF' ,'Engaging: '+target.Name());
   EquipBow();
   Orion.Wait(500);
   Orion.Attack(target.Serial());
   	while(target.Exists)
   		  {
   		   Orion.CharPrint(Player.Serial(), '0000FF' ,'Fighting: '+target.Name());
   		   Orion.Wait(1000);
   		   if(target[0].Dead()) {
	   		   return; 
   		   		}
   		   
   		  }
  }
  
  function GetNearestTarget() 
  {
  const mobs = Orion.FindTypeEx("!0x002F|!0x00A4|!0x033D",any,ground,"ignoreself|ignorefriends|live|mobile|near",'20',"gray|criminal|enemy|murderer",false,"|AutoTargetIgnore");
  return mobs;
  }
 
 function EquipBow()
{
		  	Orion.Unequip('2');
  			Orion.Wait(1500);
  			Orion.Equip(Bow);
  			Orion.Wait(500);
}

function CutCorpse()
    {
    while (!Player.Dead())
        {
        var corpse = Orion.FindType('0x2006', '0xFFFF', 'ground', 'near', '2');
        for(var c = 0; c < corpse.length; c++)
            {   // Это должно сканировать на наличие нескольких трупов ??
            cutCorpse()
            var lootcorpse = corpse[c];
            Orion.UseObject(lootcorpse);  // Open Corpse
            Orion.Wait(1200);
            var container = Orion.GetSerial(lastcontainer);
            var item = Orion.FindList('Loot',container)[0];
            while(item)
                {
                Orion.MoveItem(item);
                Orion.Wait(1200);
                item = Orion.FindList('Loot',container)[0];    
                }
            Orion.Print('Looting Done');
            }
        Orion.Wait(1000);
        }
    }

// UI ----------------------------------------------------------------------------------------------

function CreateStatusGump(){
	var _GumpStatus = Orion.CreateCustomGump(4);
	_GumpStatus.Clear();	
	_GumpStatus.AddResizepic(0, 0, "0xBB9", 250, 50); 
	
    _GumpStatus.AddText(10, 20, '0xF6F6F6', 'Current Status: '+ CurrentStatus);
    _GumpStatus.Update();	
}